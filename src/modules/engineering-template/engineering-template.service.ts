import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Readable } from 'stream';
import { EngineeringTemplate } from './entity/engineering-template.entity';

/** Required Excel column headers (first row) */
const REQUIRED_HEADERS = [
  'Template_ID',
  'Zone',
  'Shape',
  'Dim_L',
  'Dim_W',
  'Dim_H',
  'Dim_String',
  'Base_Qty',
  'Weight_Each',
  'Placement',
] as const;

interface ExcelRow {
  Template_ID: string;
  Zone: string;
  Shape: string;
  Dim_L: number;
  Dim_W: number;
  Dim_H: number;
  Dim_String: string;
  Base_Qty: number;
  Weight_Each: number;
  Placement: string;
}

@Injectable()
export class EngineeringTemplateService {
  private readonly logger = new Logger(EngineeringTemplateService.name);

  constructor(
    @InjectRepository(EngineeringTemplate)
    private readonly repo: Repository<EngineeringTemplate>,
  ) {}

  async findAll(page: number, limit: number, search?: string) {
    const qb = this.repo
      .createQueryBuilder('et')
      .orderBy('et.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.where(
        `et.template_id ILIKE :search
          OR et.zone_name   ILIKE :search
          OR et.stone_shape ILIKE :search
          OR et.placement   ILIKE :search`,
        { search: `%${search}%` },
      );
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      status: true,
      message: 'Engineering templates retrieved successfully',
      statusCode: 200,
      data: {
        items,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async uploadFromExcel(fileBuffer: Buffer): Promise<{
    inserted: number;
    updated: number;
    errors: { row: number; message: string }[];
  }> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.read(Readable.from(fileBuffer));

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new BadRequestException('Excel file has no worksheets.');
    }

    // Validate headers from first row
    const headerRow = worksheet.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell((cell) => headers.push(String(cell.value ?? '').trim()));

    for (const required of REQUIRED_HEADERS) {
      if (!headers.includes(required)) {
        throw new BadRequestException(
          `Missing required header column: "${required}"`,
        );
      }
    }

    // Build a column-index map (1-based)
    const colIndex: Record<string, number> = {};
    headers.forEach((h, i) => (colIndex[h] = i + 1));

    const results = {
      inserted: 0,
      updated: 0,
      errors: [] as { row: number; message: string }[],
    };

    const totalRows = worksheet.rowCount;
    for (let rowNum = 2; rowNum <= totalRows; rowNum++) {
      const row = worksheet.getRow(rowNum);

      // Skip completely empty rows
      const rawTemplateId = row.getCell(colIndex['Template_ID']).value;
      if (
        rawTemplateId === null ||
        rawTemplateId === undefined ||
        String(rawTemplateId).trim() === ''
      ) {
        continue;
      }

      try {
        const data: ExcelRow = {
          Template_ID: String(rawTemplateId).trim(),
          Zone: String(row.getCell(colIndex['Zone']).value ?? '').trim(),
          Shape: String(row.getCell(colIndex['Shape']).value ?? '').trim(),
          Dim_L: Number(row.getCell(colIndex['Dim_L']).value),
          Dim_W: Number(row.getCell(colIndex['Dim_W']).value),
          Dim_H: Number(row.getCell(colIndex['Dim_H']).value),
          Dim_String: String(
            row.getCell(colIndex['Dim_String']).value ?? '',
          ).trim(),
          Base_Qty: Number(row.getCell(colIndex['Base_Qty']).value),
          Weight_Each: Number(row.getCell(colIndex['Weight_Each']).value),
          Placement: String(
            row.getCell(colIndex['Placement']).value ?? '',
          ).trim(),
        };

        this.validateRow(rowNum, data);

        const existing = await this.repo.findOne({
          where: { template_id: data.Template_ID },
        });

        const entity: Partial<EngineeringTemplate> = {
          template_id: data.Template_ID,
          zone_name: data.Zone,
          stone_shape: data.Shape,
          dim_l: data.Dim_L,
          dim_w: data.Dim_W,
          dim_h: data.Dim_H,
          dim_string: data.Dim_String,
          base_qty: data.Base_Qty,
          weight_each_ct: data.Weight_Each,
          placement: data.Placement,
        };

        if (existing) {
          await this.repo.update({ template_id: data.Template_ID }, entity);
          results.updated++;
        } else {
          await this.repo.save(this.repo.create(entity));
          results.inserted++;
        }
      } catch (err) {
        if (err instanceof BadRequestException) {
          throw err; // re-throw header/structural errors
        }
        const message = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Row ${rowNum} skipped: ${message}`);
        results.errors.push({ row: rowNum, message });
      }
    }

    return results;
  }

  private validateRow(_rowNum: number, data: ExcelRow): void {
    if (!data.Template_ID) {
      throw new Error('Template_ID is required');
    }

    const numericFields: (keyof ExcelRow)[] = [
      'Dim_L',
      'Dim_W',
      'Dim_H',
      'Base_Qty',
      'Weight_Each',
    ];
    for (const field of numericFields) {
      if (isNaN(data[field] as number)) {
        throw new Error(
          `"${field}" must be a valid number (got "${data[field]}")`,
        );
      }
    }

    // Validate varchar lengths to give a clear error before the DB rejects it
    const stringLimits: {
      field: keyof ExcelRow;
      column: string;
      maxLength: number;
    }[] = [
      { field: 'Template_ID', column: 'template_id', maxLength: 150 },
      { field: 'Zone', column: 'zone_name', maxLength: 50 },
      { field: 'Shape', column: 'stone_shape', maxLength: 50 },
      { field: 'Dim_String', column: 'dim_string', maxLength: 62 },
      { field: 'Placement', column: 'placement', maxLength: 100 },
    ];

    for (const { field, column, maxLength } of stringLimits) {
      const value = String(data[field] ?? '');
      if (value.length > maxLength) {
        throw new Error(
          `Column "${column}" (Excel header: "${field}") exceeds max length of ${maxLength} ` +
            `— value has ${value.length} characters: "${value.substring(0, 60)}${value.length > 60 ? '…' : ''}"`,
        );
      }
    }
  }
}
