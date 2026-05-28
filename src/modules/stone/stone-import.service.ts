import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stone } from './entity/stone.entity';
import * as ExcelJS from 'exceljs';

interface ExcelRow {
  Stone_name?: string;
  Family?: string;
  Cut_Style?: string;
  Shape?: string;
  Clarity_grade?: string;
  Colour_grade?: string;
  origin?: string;
  Stone_type?: string;
  Enhancement?: string;
  length?: number;
  width?: number;
  height?: number;
  Size_Range?: string;
  Estimated_Weight_Final_ct?: number;
  Source_File?: string;
  Price_per_ct_INR?: number;
  Price_per_ct_USD?: number;
}

@Injectable()
export class StoneImportService {
  constructor(
    @InjectRepository(Stone)
    private readonly stoneRepository: Repository<Stone>,
  ) {}

  async importFromExcel(fileBuffer: Buffer, ext?: string) {
    const workbook = new ExcelJS.Workbook();

    try {
      if (ext === '.xls') {
        // .xls files need to be read differently
        // ExcelJS doesn't support .xls natively, try csv fallback
        throw new BadRequestException(
          'Old .xls format is not supported. Please save the file as .xlsx and re-upload.',
        );
      }
      await workbook.xlsx.load(fileBuffer as unknown as ExcelJS.Buffer);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException(
        'Failed to parse the Excel file. Please ensure it is a valid .xlsx file (not .xls or .csv renamed to .xlsx).',
      );
    }

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new BadRequestException('No worksheet found in the Excel file');
    }

    // Get header row
    const headerRow = worksheet.getRow(1);
    const headers: string[] = [];
    const colCount = worksheet.columnCount;
    for (let colNumber = 1; colNumber <= colCount; colNumber++) {
      const cell = headerRow.getCell(colNumber);
      headers[colNumber] = String(cell.value || '').trim();
    }

    console.log('Excel headers detected:', headers.filter(Boolean));

    if (headers.filter(Boolean).length === 0) {
      throw new BadRequestException('No headers found in the Excel file');
    }

    // Parse all rows
    const rows: ExcelRow[] = [];
    const rowCount = worksheet.rowCount;
    for (let rowNumber = 2; rowNumber <= rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const rowData: Record<string, any> = {};

      for (let colNumber = 1; colNumber <= colCount; colNumber++) {
        const header = headers[colNumber];
        if (header) {
          const cell = row.getCell(colNumber);
          rowData[header] =
            cell.value !== null && cell.value !== undefined ? cell.value : null;
        }
      }

      // Only add rows that have at least Stone_name
      if (rowData['Stone_name']) {
        rows.push(rowData as ExcelRow);
      }
    }

    if (rows.length === 0) {
      throw new BadRequestException(
        'No valid data rows found in the Excel file',
      );
    }

    // Process in chunks of 500
    const chunkSize = 500;
    let inserted = 0;
    let skipped = 0;
    let errors: { row: number; error: string }[] = [];
    const skippedRows: {
      row: number;
      duplicateOfRow: number;
      generatedKey: string;
    }[] = [];

    // Track generatedKey -> first occurrence row number
    const keyToRowMap = new Map<string, number>();

    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const entities: Stone[] = [];
      const entityRowIndices: number[] = [];

      for (let j = 0; j < chunk.length; j++) {
        const row = chunk[j];
        const rowIndex = i + j + 2; // +2 for 1-based index + header row

        try {
          const stone = new Stone();
          stone.stoneName = String(row.Stone_name || '');
          stone.family = row.Family ? String(row.Family) : null;
          stone.cutStyle = String(row.Cut_Style || '');
          stone.shape = String(row.Shape || '');
          stone.clarity = row.Clarity_grade ? String(row.Clarity_grade) : null;
          stone.colour = row.Colour_grade ? String(row.Colour_grade) : null;
          stone.origin = row.origin ? String(row.origin) : null;
          stone.stoneType = String(row.Stone_type || '');
          stone.enhancementTreatment = row.Enhancement
            ? String(row.Enhancement)
            : null;
          stone.length = row.length ? Number(row.length) : null;
          stone.width = row.width ? Number(row.width) : null;
          stone.height = row.height ? Number(row.height) : null;
          stone.sizeRange = row.Size_Range ? String(row.Size_Range) : null;
          stone.estimatedWeightInCt = row.Estimated_Weight_Final_ct
            ? Number(row.Estimated_Weight_Final_ct)
            : null;
          stone.sourceFile = row.Source_File ? String(row.Source_File) : null;
          stone.pricePerCt = row.Price_per_ct_INR
            ? Number(row.Price_per_ct_INR)
            : null;
          stone.pricePerCtUsd = row.Price_per_ct_USD
            ? Number(row.Price_per_ct_USD)
            : null;
          stone.is_active = true;

          // Generate the key
          stone.generateKey();

          // Check for duplicate within this import
          if (keyToRowMap.has(stone.generatedKey)) {
            skipped++;
            skippedRows.push({
              row: rowIndex,
              duplicateOfRow: keyToRowMap.get(stone.generatedKey),
              generatedKey: stone.generatedKey,
            });
          } else {
            keyToRowMap.set(stone.generatedKey, rowIndex);
            entities.push(stone);
            entityRowIndices.push(rowIndex);
          }
        } catch (err) {
          errors.push({ row: rowIndex, error: err.message });
        }
      }

      // Bulk upsert - skip duplicates based on generatedKey (for rows already in DB)
      if (entities.length > 0) {
        try {
          const result = await this.stoneRepository
            .createQueryBuilder()
            .insert()
            .into(Stone)
            .values(entities)
            .orIgnore() // skip rows with duplicate generatedKey already in DB
            .execute();

          const insertedCount = result.identifiers.filter(
            (id) => id !== undefined && id !== null,
          ).length;
          const dbSkippedCount = entities.length - insertedCount;

          inserted += insertedCount;
          skipped += dbSkippedCount;

          // If some were skipped by DB, log them as "duplicate of existing DB record"
          if (dbSkippedCount > 0) {
            // Identify which ones were skipped by checking which identifiers are null
            for (let k = 0; k < result.identifiers.length; k++) {
              if (
                result.identifiers[k] === undefined ||
                result.identifiers[k] === null ||
                !result.identifiers[k].id
              ) {
                skippedRows.push({
                  row: entityRowIndices[k],
                  duplicateOfRow: -1, // -1 means already exists in DB
                  generatedKey: entities[k].generatedKey,
                });
              }
            }
          }
        } catch {
          for (let k = 0; k < entities.length; k++) {
            try {
              await this.stoneRepository
                .createQueryBuilder()
                .insert()
                .into(Stone)
                .values(entities[k])
                .orIgnore()
                .execute();
              inserted++;
            } catch (singleErr) {
              skipped++;
              errors.push({
                row: entityRowIndices[k],
                error: singleErr.message,
              });
            }
          }
        }
      }
    }

    // Cap skippedRows and errors for response size
    const totalErrors = errors.length;
    const totalSkipped = skippedRows.length;
    if (errors.length > 50) {
      errors = errors.slice(0, 50);
    }

    return {
      status: true,
      message: 'Excel import completed',
      statusCode: 200,
      data: {
        totalRows: rows.length,
        inserted,
        skipped,
        totalErrors,
        errors: errors.length > 0 ? errors : undefined,
        skippedRows:
          skippedRows.length > 0
            ? {
                total: totalSkipped,
                details: skippedRows.slice(0, 100).map((s) => ({
                  row: s.row,
                  duplicateOf:
                    s.duplicateOfRow === -1
                      ? 'Already exists in database'
                      : `Row ${s.duplicateOfRow}`,
                  generatedKey: s.generatedKey,
                })),
              }
            : undefined,
      },
    };
  }
}
