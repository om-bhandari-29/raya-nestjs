import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { Readable } from 'stream';
import csvParser from 'csv-parser';

export interface ArchetypeCsvRow {
  config_id?: string;
  design_slug?: string;
  variant_slug?: string;
  zone_name?: string;
  shape_normalized?: string;
  dim_l_mm?: string;
  dim_w_mm?: string;
  qty_model?: string;
  [key: string]: any;
}

export interface ImportMetrics {
  blueprintsProcessed: number;
  zoneSlotsInserted: number;
  sizeMatrixRowsInserted: number;
}

/** Batch size for multi-row INSERT statements */
const BATCH_SIZE = 500;

const RING_SIZES = [
  '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5',
  '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5',
  '11.0', '11.5', '12.0', '12.5', '13.0',
];

interface SizeMatrixTuple {
  zoneSlotId: number;
  ringSize: number;
  stoneQuantity: number;
}

interface MetalWeightTuple {
  variantId: number;
  ringSize: number;
  baseMetalWeightGm: number;
}

@Injectable()
export class ArchetypeImportService {
  private readonly logger = new Logger(ArchetypeImportService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async importArchetypesFromBuffer(buffer: Buffer): Promise<ImportMetrics> {
    this.logger.log('Starting Archetype import processing pipeline...');

    let rows: ArchetypeCsvRow[];
    // Detect Excel format via PK header (Zip archive signature)
    if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
      this.logger.log('Detected Excel (.xlsx) format. Parsing via exceljs...');
      rows = await this.parseExcelBuffer(buffer);
    } else {
      this.logger.log('Detected CSV format. Parsing via csv-parser...');
      rows = await this.convertCsvToObjects(buffer);
    }

    this.logger.log(`Parsed ${rows.length} total structural layout rows.`);

    const groups = new Map<string, ArchetypeCsvRow[]>();
    for (const row of rows) {
      const designSlug = (
        row.design_slug ||
        row.Design_Slug ||
        row['design_slug'] ||
        ''
      )
        .toString()
        .trim();
      const variantSlug = (
        row.variant_slug ||
        row.Variant_Slug ||
        row['variant_slug'] ||
        ''
      )
        .toString()
        .trim();

      if (!designSlug || !variantSlug) {
        continue;
      }

      const key = `${designSlug}::${variantSlug}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(row);
    }

    this.logger.log(
      `Grouped into ${groups.size} distinct design/variant blueprint tracks.`,
    );

    const result: ImportMetrics = {
      blueprintsProcessed: 0,
      zoneSlotsInserted: 0,
      sizeMatrixRowsInserted: 0,
    };

    if (groups.size === 0) {
      this.logger.warn(
        'No valid groups extracted from CSV data rows. Aborting database run.',
      );
      return result;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Accumulators for batched inserts
      let sizeMatrixBatch: SizeMatrixTuple[] = [];
      let metalWeightBatch: MetalWeightTuple[] = [];

      for (const [key, groupRows] of groups.entries()) {
        const [designSlug, variantSlug] = key.split('::');

        const designId = await this.upsertProductDesign(
          queryRunner,
          designSlug,
        );
        const blueprintId = await this.upsertArchetypeBlueprint(
          queryRunner,
          designId,
          variantSlug,
        );
        result.blueprintsProcessed++;

        for (const row of groupRows) {
          const validZone = row.zone_name || row.Zone_Name || row['zone_name'];
          if (!validZone) {
            continue;
          }

          const slotId = await this.upsertArchetypeZoneSlot(
            queryRunner,
            blueprintId,
            row,
          );
          result.zoneSlotsInserted++;

          // Collect size matrix and metal weight tuples instead of inserting one-by-one
          this.collectSizeMatrixTuples(
            slotId,
            row,
            blueprintId,
            sizeMatrixBatch,
            metalWeightBatch,
          );

          // Flush when batch is full
          if (sizeMatrixBatch.length >= BATCH_SIZE) {
            result.sizeMatrixRowsInserted += await this.flushSizeMatrixBatch(
              queryRunner,
              sizeMatrixBatch,
            );
            sizeMatrixBatch = [];
          }
          if (metalWeightBatch.length >= BATCH_SIZE) {
            await this.flushMetalWeightBatch(queryRunner, metalWeightBatch);
            metalWeightBatch = [];
          }
        }
      }

      // Flush remaining tuples
      if (sizeMatrixBatch.length > 0) {
        result.sizeMatrixRowsInserted += await this.flushSizeMatrixBatch(
          queryRunner,
          sizeMatrixBatch,
        );
      }
      if (metalWeightBatch.length > 0) {
        await this.flushMetalWeightBatch(queryRunner, metalWeightBatch);
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `Archetype database transaction successfully committed. Blueprints: ${result.blueprintsProcessed}, Slots: ${result.zoneSlotsInserted}, Matrix Rows: ${result.sizeMatrixRowsInserted}`,
      );
    } catch (err) {
      this.logger.error(
        'Archetype data import failed, rolling back active transaction state...',
        (err as Error).stack,
      );
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return result;
  }

  /**
   * Collects size matrix and metal weight tuples from a row into the batch arrays.
   * No DB calls happen here — just data accumulation.
   */
  private collectSizeMatrixTuples(
    zoneSlotId: number,
    row: ArchetypeCsvRow,
    blueprintId: number,
    sizeMatrixBatch: SizeMatrixTuple[],
    metalWeightBatch: MetalWeightTuple[],
  ): void {
    for (const size of RING_SIZES) {
      const colSuffix = size.replace('.', '_');
      const qtyKey = `qty_${colSuffix}`;
      const wtKey = `metal_wt_${colSuffix}`;

      const rawQty = row[qtyKey] || row[qtyKey.toUpperCase()] || '0';
      const rawWt = row[wtKey] || row[wtKey.toUpperCase()] || '0';

      const qty = parseInt(rawQty, 10);
      const metalWt = parseFloat(rawWt);

      if (qty > 0) {
        sizeMatrixBatch.push({
          zoneSlotId,
          ringSize: parseFloat(size),
          stoneQuantity: qty,
        });
      }

      if (metalWt > 0) {
        metalWeightBatch.push({
          variantId: blueprintId,
          ringSize: parseFloat(size),
          baseMetalWeightGm: metalWt,
        });
      }
    }
  }

  /**
   * Flushes accumulated size matrix tuples as a single multi-row INSERT.
   * Deduplicates by (zone_slot_id, ring_size) keeping the last occurrence (last write wins).
   * Returns the number of unique rows inserted.
   */
  private async flushSizeMatrixBatch(
    queryRunner: QueryRunner,
    batch: SizeMatrixTuple[],
  ): Promise<number> {
    if (batch.length === 0) return 0;

    // Deduplicate: keep last occurrence per (zoneSlotId, ringSize)
    const deduped = new Map<string, SizeMatrixTuple>();
    for (const tuple of batch) {
      deduped.set(`${tuple.zoneSlotId}::${tuple.ringSize}`, tuple);
    }

    const uniqueTuples = Array.from(deduped.values());
    const values: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;

    for (const tuple of uniqueTuples) {
      values.push(`($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2})`);
      params.push(tuple.zoneSlotId, tuple.ringSize, tuple.stoneQuantity);
      paramIdx += 3;
    }

    const sql = `
      INSERT INTO blueprint_size_matrix (zone_slot_id, ring_size, stone_quantity)
      VALUES ${values.join(', ')}
      ON CONFLICT (zone_slot_id, ring_size)
      DO UPDATE SET stone_quantity = EXCLUDED.stone_quantity;
    `;

    await queryRunner.query(sql, params);
    return uniqueTuples.length;
  }

  /**
   * Flushes accumulated metal weight tuples as a single multi-row INSERT.
   * Deduplicates by (variant_id, ring_size) keeping the last occurrence (last write wins).
   */
  private async flushMetalWeightBatch(
    queryRunner: QueryRunner,
    batch: MetalWeightTuple[],
  ): Promise<void> {
    if (batch.length === 0) return;

    // Deduplicate: keep last occurrence per (variantId, ringSize)
    const deduped = new Map<string, MetalWeightTuple>();
    for (const tuple of batch) {
      deduped.set(`${tuple.variantId}::${tuple.ringSize}`, tuple);
    }

    const uniqueTuples = Array.from(deduped.values());
    const values: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;

    for (const tuple of uniqueTuples) {
      values.push(`($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2})`);
      params.push(tuple.variantId, tuple.ringSize, tuple.baseMetalWeightGm);
      paramIdx += 3;
    }

    const sql = `
      INSERT INTO metal_weight_matrix (variant_id, ring_size, base_metal_weight_gm)
      VALUES ${values.join(', ')}
      ON CONFLICT (variant_id, ring_size)
      DO UPDATE SET base_metal_weight_gm = EXCLUDED.base_metal_weight_gm;
    `;

    await queryRunner.query(sql, params);
  }

  private async parseExcelBuffer(buffer: Buffer): Promise<ArchetypeCsvRow[]> {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);
    const rows: ArchetypeCsvRow[] = [];

    const headers: string[] = [];
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell: any, colNumber: number) => {
      headers[colNumber] = cell.value
        ? cell.value
            .toString()
            .trim()
            .replace(/^\ufeff/, '')
        : '';
    });

    worksheet.eachRow((row: any, rowNumber: number) => {
      if (rowNumber === 1) return;
      const rowData: ArchetypeCsvRow = {};
      row.eachCell((cell: any, colNumber: number) => {
        const header = headers[colNumber];
        if (header) {
          const val =
            cell.value &&
            typeof cell.value === 'object' &&
            'result' in cell.value
              ? cell.value.result
              : cell.value;
          rowData[header] = val;
        }
      });
      rows.push(rowData);
    });

    return rows;
  }

  private async convertCsvToObjects(
    buffer: Buffer,
  ): Promise<ArchetypeCsvRow[]> {
    return new Promise((resolve, reject) => {
      const results: ArchetypeCsvRow[] = [];

      Readable.from(buffer)
        .pipe(
          csvParser({
            mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, ''),
          }),
        )
        .on('data', (data: ArchetypeCsvRow) => results.push(data))
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error: any) => {
          reject(error);
        });
    });
  }

  private async upsertProductDesign(
    queryRunner: QueryRunner,
    designSlug: string,
  ): Promise<number> {
    const sql = `
      INSERT INTO product_designs (design_slug)
      VALUES ($1)
      ON CONFLICT (design_slug)
      DO NOTHING
      RETURNING id;
    `;
    const res = await queryRunner.query(sql, [designSlug.trim()]);
    if (res && res.length > 0) {
      return res[0].id;
    }
    const selectRes = await queryRunner.query(
      `SELECT id FROM product_designs WHERE design_slug = $1`,
      [designSlug.trim()],
    );
    return selectRes[0].id;
  }

  private async upsertArchetypeBlueprint(
    queryRunner: QueryRunner,
    designId: number,
    variantName: string,
  ): Promise<number> {
    const sql = `
      INSERT INTO product_blueprints (design_id, variant_name, target_gender)
      VALUES ($1, $2, $3)
      ON CONFLICT (design_id, variant_name, target_gender)
      DO UPDATE SET variant_name = EXCLUDED.variant_name
      RETURNING id;
    `;
    const res = await queryRunner.query(sql, [
      designId,
      variantName.trim(),
      'Women',
    ]);
    return res[0].id;
  }

  private async upsertArchetypeZoneSlot(
    queryRunner: QueryRunner,
    blueprintId: number,
    row: ArchetypeCsvRow,
  ): Promise<number> {
    const zoneName = (
      row.zone_name ||
      row.Zone_Name ||
      row['zone_name']
    ).trim();
    const shapeNormalized = (
      row.shape_normalized ||
      row.Shape_Normalized ||
      row['shape_normalized'] ||
      'round'
    )
      .trim()
      .toLowerCase();
    const dimL = row.dim_l_mm || row.dim_l || '0';
    const dimW = row.dim_w_mm || row.dim_w || '0';
    const qtyModel = row.qty_model || row.Qty_Model || '';

    const templateId = `TPL-${zoneName}-${shapeNormalized}-${dimL}x${dimW}`;
    const isDynamic = qtyModel.trim() === 'CIRCUMFERENCE_BASED';

    const rawFixedQty = row.qty_7_0 || row['qty_7_0'] || row.qty_70 || '0';
    const fixedQty = isDynamic ? null : parseInt(rawFixedQty, 10);

    const dimLVal = dimL ? parseFloat(dimL.toString()) : null;
    const dimWVal = dimW ? parseFloat(dimW.toString()) : null;

    const sql = `
      INSERT INTO blueprint_zone_slots 
        (blueprint_id, zone_name, shape_normalized, dim_l_mm, dim_w_mm, template_id, is_dynamic_by_size, fixed_quantity)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (blueprint_id, zone_name, shape_normalized)
      DO UPDATE SET
        dim_l_mm           = EXCLUDED.dim_l_mm,
        dim_w_mm           = EXCLUDED.dim_w_mm,
        template_id        = EXCLUDED.template_id,
        is_dynamic_by_size = EXCLUDED.is_dynamic_by_size,
        fixed_quantity     = EXCLUDED.fixed_quantity
      RETURNING id;
    `;

    const res = await queryRunner.query(sql, [
      blueprintId,
      zoneName,
      shapeNormalized,
      dimLVal,
      dimWVal,
      templateId,
      isDynamic,
      fixedQty,
    ]);

    return res[0].id;
  }

  async getArchetypesPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const offset = (page - 1) * limit;
    const countParams: any[] = [];
    const dataParams: any[] = [];
    let whereClause = '';

    if (search) {
      const searchPattern = `%${search}%`;
      whereClause = `WHERE (pd.design_slug ILIKE $1 OR pb.variant_name ILIKE $1)`;
      countParams.push(searchPattern);
      dataParams.push(searchPattern);
    }

    // Count unique design_slugs
    const countSql = `
      SELECT COUNT(DISTINCT pd.design_slug) as total 
      FROM product_blueprints pb
      INNER JOIN product_designs pd ON pb.design_id = pd.id
      ${whereClause}
    `;

    // Adjust parameter indices for limit and offset in data query
    const limitIdx = dataParams.length + 1;
    const offsetIdx = dataParams.length + 2;

    // Get unique designs and order by the latest variant ID descending
    const dataSql = `
      SELECT 
        pb.id, pb.design_id, pd.design_slug, pb.variant_name, pb.target_gender 
      FROM (
        SELECT DISTINCT ON (design_id) 
          id, design_id, variant_name, target_gender
        FROM product_blueprints
        ORDER BY design_id, id DESC
      ) pb
      INNER JOIN product_designs pd ON pb.design_id = pd.id
      ${whereClause}
      ORDER BY pb.id DESC 
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;
    dataParams.push(limit, offset);

    const [countRes, dataRes] = await Promise.all([
      this.dataSource.query(countSql, countParams),
      this.dataSource.query(dataSql, dataParams),
    ]);

    const total = parseInt(countRes[0].total, 10);

    return {
      status: true,
      message: 'Archetypes retrieved successfully',
      statusCode: 200,
      data: {
        items: dataRes,
      },
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
