import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { Readable } from 'stream';
import * as csvParser from 'csv-parser';
import { BlueprintListItemDto } from './dto/blueprint-list.dto';

// ... (rest of imports and constants)

// ─── Column header names — verified against actual spreadsheet ──────────────
//
// Full confirmed header list (43 columns):
//   SKU_ID, Design, Variant, Metal, Color, Ring_Size, Gender,
//   CENTER_Template_ID, CENTER_Stone_IDs, CENTER_Shape, CENTER_Dim,
//     CENTER_Qty, CENTER_Wt_Each, CENTER_Wt_Total,
//   HALO_Template_ID, HALO_Stone_IDs, HALO_Shape, HALO_Dim,
//     HALO_Qty, HALO_Wt_Each, HALO_Wt_Total,
//   GALLERY_Template_ID, GALLERY_Stone_IDs, GALLERY_Shape, GALLERY_Dim,
//     GALLERY_Qty, GALLERY_Wt_Each, GALLERY_Wt_Total,
//   SHANK_Template_ID, SHANK_Stone_IDs, SHANK_Shape, SHANK_Dim,
//     SHANK_Qty, SHANK_Wt_Each, SHANK_Wt_Total,
//   ACCENT_Template_ID, ACCENT_Stone_IDs, ACCENT_Shape, ACCENT_Dim,
//     ACCENT_Qty, ACCENT_Wt_Each, ACCENT_Wt_Total,
//   Total_CTW
//
// The importer only reads the columns below. All weight, shape, dimension,
// stone-ID, and Total_CTW columns are intentionally ignored — they describe
// physical stone attributes, not the structural blueprint schema.
const COL = {
  DESIGN: 'Design',
  VARIANT: 'Variant',
  GENDER: 'Gender',
  METAL: 'Metal',
  COLOR: 'Color',
  RING_SIZE: 'Ring_Size',
} as const;

// Per-zone derived column names follow the pattern:
//   Qty column       → `${zone}_Qty`          e.g. CENTER_Qty, HALO_Qty
//   Template column  → `${zone}_Template_ID`  e.g. CENTER_Template_ID
// Both patterns are confirmed against the actual spreadsheet headers.

// The five structural zones resolved for every blueprint
const ZONES = ['CENTER', 'HALO', 'GALLERY', 'SHANK', 'ACCENT'] as const;
type Zone = (typeof ZONES)[number];

// Each raw CSV row typed loosely — headers are all string values from the parser
type CsvRow = Record<string, string>;

// Per-group aggregation bucket
interface DesignGroup {
  designSlug: string;
  variantName: string;
  targetGender: string;
  rows: CsvRow[];
}

// Final counters returned to the controller
export interface ImportResult {
  blueprintsProcessed: number;
  metalOptionsInserted: number;
  zoneSlotsInserted: number;
  sizeMatrixRowsInserted: number;
}
interface ArchetypeCsvRow {
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

interface ImportMetrics {
  blueprintsProcessed: number;
  zoneSlotsInserted: number;
  sizeMatrixRowsInserted: number;
}

@Injectable()
export class ProductsImportService {
  private readonly logger = new Logger(ProductsImportService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  // ─── Public entry-point ─────────────────────────────────────────────────────

  async importFromBuffer(buffer: Buffer): Promise<ImportResult> {
    this.logger.log('Starting CSV import — parsing file buffer into memory...');

    const rows = await this.parseCsvBuffer(buffer);
    this.logger.log(`Parsed ${rows.length} raw rows from CSV.`);

    const groups = this.groupRows(rows);
    this.logger.log(
      `Identified ${groups.size} unique design groups to process.`,
    );

    const result: ImportResult = {
      blueprintsProcessed: 0,
      metalOptionsInserted: 0,
      zoneSlotsInserted: 0,
      sizeMatrixRowsInserted: 0,
    };

    for (const group of groups.values()) {
      await this.processGroup(group, result);
    }

    this.logger.log(
      `Import finished — blueprints: ${result.blueprintsProcessed}, ` +
      `metal options: ${result.metalOptionsInserted}, ` +
      `zone slots: ${result.zoneSlotsInserted}, ` +
      `size matrix rows: ${result.sizeMatrixRowsInserted}.`,
    );

    return result;
  }

  // ─── CSV Parsing ────────────────────────────────────────────────────────────

  /**
   * Converts a Buffer to a Node Readable stream and pipes it through csv-parser.
   * Resolves once the stream is fully consumed — no temp files, no fs I/O.
   */
  private parseCsvBuffer(buffer: Buffer): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
      const rows: CsvRow[] = [];

      const readable = new Readable({
        read() {
          this.push(buffer);
          this.push(null); // signal EOF
        },
      });

      readable
        .pipe(csvParser())
        .on('data', (row: CsvRow) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', (err) => reject(err));
    });
  }

  // ─── Grouping ───────────────────────────────────────────────────────────────

  /**
   * Groups every row by the composite key Design::Variant::Gender.
   * This is the core de-duplication that collapses 50k+ exploded rows into a
   * small number of unique design tracks.
   */
  private groupRows(rows: CsvRow[]): Map<string, DesignGroup> {
    const groups = new Map<string, DesignGroup>();

    for (const row of rows) {
      const designSlug = (row[COL.DESIGN] ?? '').trim();
      const variantName = (row[COL.VARIANT] ?? '').trim();
      const targetGender = (row[COL.GENDER] ?? '').trim();

      // Skip rows with missing key fields
      if (!designSlug || !variantName || !targetGender) continue;

      const key = `${designSlug}::${variantName}::${targetGender}`;

      if (!groups.has(key)) {
        groups.set(key, { designSlug, variantName, targetGender, rows: [] });
      }

      groups.get(key)!.rows.push(row);
    }

    return groups;
  }

  // ─── Group Processing ───────────────────────────────────────────────────────

  private async processGroup(
    group: DesignGroup,
    result: ImportResult,
  ): Promise<void> {
    const { designSlug, variantName, targetGender, rows } = group;

    // 1. Upsert the blueprint and get back its ID
    const blueprintId = await this.upsertBlueprint(
      designSlug,
      variantName,
      targetGender,
    );
    result.blueprintsProcessed++;

    this.logger.debug(
      `Processing blueprint #${blueprintId}: "${designSlug} / ${variantName} / ${targetGender}" (${rows.length} rows)`,
    );

    // 2. Extract and insert unique metal+color combinations
    const metalCount = await this.upsertMetalOptions(blueprintId, rows);
    result.metalOptionsInserted += metalCount;

    // 3. Resolve each structural zone
    for (const zone of ZONES) {
      const zoneResult = await this.upsertZoneSlot(blueprintId, zone, rows);
      if (zoneResult !== null) {
        result.zoneSlotsInserted++;
        result.sizeMatrixRowsInserted += zoneResult.sizeMatrixRowsInserted;
      }
    }
  }

  // ─── 1. product_blueprints UPSERT ───────────────────────────────────────────

  private async upsertBlueprint(
    designSlug: string,
    variantName: string,
    targetGender: string,
  ): Promise<number> {
    const sql = `
      INSERT INTO product_blueprints (design_slug, variant_name, target_gender)
      VALUES ($1, $2, $3)
      ON CONFLICT (design_slug, variant_name, target_gender)
      DO UPDATE SET
        design_slug   = EXCLUDED.design_slug,
        variant_name  = EXCLUDED.variant_name,
        target_gender = EXCLUDED.target_gender
      RETURNING id
    `;

    const rows: Array<{ id: number }> = await this.dataSource.query(sql, [
      designSlug,
      variantName,
      targetGender,
    ]);

    return rows[0].id;
  }

  // ─── 2. product_metal_options UPSERT ────────────────────────────────────────

  private async upsertMetalOptions(
    blueprintId: number,
    rows: CsvRow[],
  ): Promise<number> {
    // Collect unique Metal+Color pairs using a Set of serialised keys
    const seen = new Set<string>();
    const uniquePairs: Array<{ metal: string; color: string }> = [];

    for (const row of rows) {
      const metal = (row[COL.METAL] ?? '').trim();
      const color = (row[COL.COLOR] ?? '').trim();
      if (!metal || !color) continue;

      const key = `${metal}::${color}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePairs.push({ metal, color });
      }
    }

    if (uniquePairs.length === 0) return 0;

    const sql = `
      INSERT INTO product_metal_options (blueprint_id, metal_purity, metal_color)
      VALUES ($1, $2, $3)
      ON CONFLICT (blueprint_id, metal_purity, metal_color)
      DO UPDATE SET
        metal_purity = EXCLUDED.metal_purity,
        metal_color  = EXCLUDED.metal_color
    `;

    for (const { metal, color } of uniquePairs) {
      await this.dataSource.query(sql, [blueprintId, metal, color]);
    }

    this.logger.debug(
      `  [Metal] blueprint #${blueprintId}: ${uniquePairs.length} unique metal/color combos upserted.`,
    );

    return uniquePairs.length;
  }

  // ─── 3 + 4. blueprint_zone_slots & blueprint_size_matrix UPSERT ─────────────

  private async upsertZoneSlot(
    blueprintId: number,
    zone: Zone,
    rows: CsvRow[],
  ): Promise<{ sizeMatrixRowsInserted: number } | null> {
    const qtyCol = `${zone}_Qty`;
    const templateCol = `${zone}_Template_ID`;

    // A zone is active only when at least one row has a stone qty > 0
    const activeRows = rows.filter((r) => {
      const qty = parseFloat(r[qtyCol] ?? '0');
      return !isNaN(qty) && qty > 0;
    });

    if (activeRows.length === 0) {
      return null; // zone is not used by this design group
    }

    // Find the first row that provides a template ID
    const templateRow = activeRows.find(
      (r) => r[templateCol] && r[templateCol].trim() !== '',
    );

    if (!templateRow) {
      this.logger.warn(
        `  [Zone ${zone}] blueprint #${blueprintId}: active zone has no template ID — skipping.`,
      );
      return null;
    }

    const templateId = templateRow[templateCol].trim();

    // Analyse whether the qty fluctuates across different ring sizes
    const { isDynamic, fixedQty } = this.analyseZoneDynamism(
      activeRows,
      qtyCol,
    );

    // ── Upsert the zone slot ──────────────────────────────────────────────────
    const slotSql = `
      INSERT INTO blueprint_zone_slots
        (blueprint_id, zone_name, template_id, is_dynamic_by_size, fixed_quantity)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (blueprint_id, zone_name)
      DO UPDATE SET
        template_id        = EXCLUDED.template_id,
        is_dynamic_by_size = EXCLUDED.is_dynamic_by_size,
        fixed_quantity     = EXCLUDED.fixed_quantity
      RETURNING id
    `;

    const slotRows: Array<{ id: number }> = await this.dataSource.query(
      slotSql,
      [blueprintId, zone, templateId, isDynamic, isDynamic ? null : fixedQty],
    );

    const zoneSlotId = slotRows[0].id;

    this.logger.debug(
      `  [Zone ${zone}] blueprint #${blueprintId}: slot #${zoneSlotId} upserted ` +
      `(dynamic=${isDynamic}, fixedQty=${fixedQty ?? 'n/a'}).`,
    );

    // ── Upsert size matrix only when the zone is dynamic ─────────────────────
    let sizeMatrixRowsInserted = 0;

    if (isDynamic) {
      sizeMatrixRowsInserted = await this.upsertSizeMatrix(
        zoneSlotId,
        zone,
        rows,
      );
    }

    return { sizeMatrixRowsInserted };
  }

  // ─── Dynamism Analysis ──────────────────────────────────────────────────────

  /**
   * Checks whether the stone quantity for a zone is constant or varies by ring size.
   *
   * Strategy:
   *   - Build a Map<ringSize, Set<qty>>. If any ring size maps to more than one
   *     distinct qty, or if the overall Set of distinct qtys across all sizes
   *     has more than one member, the zone is dynamic.
   */
  private analyseZoneDynamism(
    rows: CsvRow[],
    qtyCol: string,
  ): { isDynamic: boolean; fixedQty: number | null } {
    const allQtys = new Set<number>();

    for (const row of rows) {
      const qty = parseFloat(row[qtyCol] ?? '0');
      if (!isNaN(qty) && qty > 0) {
        allQtys.add(qty);
      }
    }

    if (allQtys.size > 1) {
      // Multiple distinct stone counts found across different sizes → dynamic
      return { isDynamic: true, fixedQty: null };
    }

    // Single constant qty across all rows
    const [fixedQty] = allQtys;
    return { isDynamic: false, fixedQty: fixedQty ?? null };
  }

  // ─── 4. blueprint_size_matrix UPSERT ────────────────────────────────────────

  private async upsertSizeMatrix(
    zoneSlotId: number,
    zone: Zone,
    rows: CsvRow[],
  ): Promise<number> {
    const qtyCol = `${zone}_Qty`;

    // Deduplicate by ring size — last writer wins (matches spreadsheet top→bottom order)
    const sizeMap = new Map<number, number>();

    for (const row of rows) {
      const ringSizeRaw = parseFloat(row[COL.RING_SIZE] ?? '');
      const qty = parseInt(row[qtyCol] ?? '0', 10);

      if (isNaN(ringSizeRaw) || isNaN(qty) || qty <= 0) continue;

      sizeMap.set(ringSizeRaw, qty);
    }

    if (sizeMap.size === 0) return 0;

    const sql = `
      INSERT INTO blueprint_size_matrix (zone_slot_id, ring_size, stone_quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (zone_slot_id, ring_size)
      DO UPDATE SET
        stone_quantity = EXCLUDED.stone_quantity
    `;

    for (const [ringSize, stoneQty] of sizeMap.entries()) {
      await this.dataSource.query(sql, [zoneSlotId, ringSize, stoneQty]);
    }

    this.logger.debug(
      `    [Size Matrix] zone slot #${zoneSlotId} (${zone}): ${sizeMap.size} ring-size rows upserted.`,
    );

    return sizeMap.size;
  }

  // ─── Querying ───────────────────────────────────────────────────────────────

  /**
   * This API will scan your product_blueprints table and group by design_slug
   */
  async getBlueprintsGroupedByDesign(): Promise<BlueprintListItemDto[]> {
    const sql = `
      SELECT DISTINCT ON (design_slug)
        id,
        design_slug,
        variant_name,
        target_gender
      FROM product_blueprints
      ORDER BY design_slug ASC, id ASC
    `;
    return await this.dataSource.query(sql);
  }

  // async getProductDetails(designSlug: string) {
  //   // STEP 1: Query Core Product Blueprint Meta
  //   const blueprints = await this.dataSource.query(
  //     `SELECT id, variant_name, target_gender
  //      FROM product_blueprints
  //      WHERE design_slug = $1`,
  //     [designSlug],
  //   );

  //   if (!blueprints || blueprints.length === 0) {
  //     const { NotFoundException } = await import('@nestjs/common');
  //     throw new NotFoundException('Product blueprint not found');
  //   }

  //   const blueprint = blueprints[0];
  //   const blueprintId = blueprint.id;

  //   // STEP 2: Query Permitted Metal Options
  //   const metalOptions = await this.dataSource.query(
  //     `SELECT metal_purity, metal_color
  //      FROM product_metal_options
  //      WHERE blueprint_id = $1`,
  //     [blueprintId],
  //   );

  //   // STEP 3: Query Active Structural Zone Slots
  //   const zoneSlots = await this.dataSource.query(
  //     `SELECT id as zone_slot_id, zone_name, template_id, is_dynamic_by_size, fixed_quantity
  //      FROM blueprint_zone_slots
  //      WHERE blueprint_id = $1`,
  //     [blueprintId],
  //   );

  //   // STEP 4: Resolve the Sizing Sub-Matrix Array
  //   for (const slot of zoneSlots) {
  //     if (slot.is_dynamic_by_size) {
  //       const matrix = await this.dataSource.query(
  //         `SELECT ring_size, stone_quantity
  //          FROM blueprint_size_matrix
  //          WHERE zone_slot_id = $1
  //          ORDER BY ring_size ASC`,
  //         [slot.zone_slot_id],
  //       );
  //       slot.size_quantity_matrix = matrix;
  //     } else {
  //       slot.size_quantity_matrix = null;
  //     }
  //   }

  //   return {
  //     success: true,
  //     data: {
  //       design_slug: designSlug,
  //       variant: blueprint.variant_name,
  //       gender: blueprint.target_gender,
  //       allowed_metals: metalOptions,
  //       zone_slots: zoneSlots,
  //     },
  //   };
  // }
  async getProductDetails(designSlug: string) {
    // STEP 1: Query ALL Core Product Blueprint Variants for the slug
    const blueprints = await this.dataSource.query(
      `SELECT id, variant_name, target_gender 
     FROM product_blueprints 
     WHERE design_slug = $1`,
      [designSlug],
    );

    if (!blueprints || blueprints.length === 0) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException(
        'No product blueprints found for this design slug',
      );
    }

    // Extract all blueprint IDs to batch-fetch related records
    const blueprintIds = blueprints.map((b) => b.id);

    // STEP 2: Query Permitted Metal Options for all fetched blueprints
    const allMetalOptions = await this.dataSource.query(
      `SELECT blueprint_id, metal_purity, metal_color 
     FROM product_metal_options 
     WHERE blueprint_id = ANY($1)`,
      [blueprintIds],
    );

    // STEP 3: Query Active Structural Zone Slots for all fetched blueprints
    const allZoneSlots = await this.dataSource.query(
      `SELECT id as zone_slot_id, blueprint_id, zone_name, template_id, is_dynamic_by_size, fixed_quantity 
     FROM blueprint_zone_slots 
     WHERE blueprint_id = ANY($1)`,
      [blueprintIds],
    );

    // STEP 4: Resolve Sizing Sub-Matrix Array if any slot is dynamic
    const dynamicZoneSlotIds = allZoneSlots
      .filter((slot) => slot.is_dynamic_by_size)
      .map((slot) => slot.zone_slot_id);

    let allMatrices = [];
    if (dynamicZoneSlotIds.length > 0) {
      allMatrices = await this.dataSource.query(
        `SELECT zone_slot_id, ring_size, stone_quantity 
       FROM blueprint_size_matrix 
       WHERE zone_slot_id = ANY($1) 
       ORDER BY ring_size ASC`,
        [dynamicZoneSlotIds],
      );
    }

    // STEP 5: Map Matrix Sub-Arrays back to their respective Zone Slots
    const slotsWithMatrix = allZoneSlots.map((slot) => {
      return {
        zone_slot_id: slot.zone_slot_id,
        blueprint_id: slot.blueprint_id,
        zone_name: slot.zone_name,
        template_id: slot.template_id,
        is_dynamic_by_size: slot.is_dynamic_by_size,
        fixed_quantity: slot.fixed_quantity,
        size_quantity_matrix: slot.is_dynamic_by_size
          ? allMatrices
            .filter((m) => m.zone_slot_id === slot.zone_slot_id)
            .map(({ ring_size, stone_quantity }) => ({
              ring_size,
              stone_quantity,
            }))
          : null,
      };
    });

    // STEP 6: Assemble the final nested structure per variant
    const variantsData = blueprints.map((blueprint) => {
      const allowedMetals = allMetalOptions
        .filter((m) => m.blueprint_id === blueprint.id)
        .map(({ metal_purity, metal_color }) => ({
          metal_purity,
          metal_color,
        }));

      const zoneSlots = slotsWithMatrix
        .filter((slot) => slot.blueprint_id === blueprint.id)
        // Remove blueprint_id from final output to keep it clean
        .map(({ blueprint_id, ...rest }) => rest);

      return {
        variant: blueprint.variant_name,
        gender: blueprint.target_gender,
        allowed_metals: allowedMetals,
        zone_slots: zoneSlots,
      };
    });

    return {
      success: true,
      data: {
        design_slug: designSlug,
        variants: variantsData,
      },
    };
  }

  // ─── Archetype Import ──────────────────────────────────────────────────────
  async importArchetypesFromBuffer(buffer: Buffer): Promise<ImportMetrics> {
    this.logger.log('Starting Archetype import processing pipeline...');

    let rows: ArchetypeCsvRow[];
    // Detect Excel format via PK header (Zip archive signature)
    if (buffer[0] === 0x50 && buffer[1] === 0x4B) {
      this.logger.log('Detected Excel (.xlsx) format. Parsing via exceljs...');
      rows = await this.parseExcelBuffer(buffer);
    } else {
      this.logger.log('Detected CSV format. Parsing via csv-parser...');
      rows = await this.convertCsvToObjects(buffer);
    }

    this.logger.log(`Parsed ${rows.length} total structural layout rows.`);

    const groups = new Map<string, ArchetypeCsvRow[]>();
    for (const row of rows) {
      // Robust lookup for design and variant slugs
      const designSlug = (row.design_slug || row.Design_Slug || row['design_slug'] || '').toString().trim();
      const variantSlug = (row.variant_slug || row.Variant_Slug || row['variant_slug'] || '').toString().trim();

      if (!designSlug || !variantSlug) {
        continue;
      }

      const key = `${designSlug}::${variantSlug}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(row);
    }

    this.logger.log(`Grouped into ${groups.size} distinct design/variant blueprint tracks.`);

    const result: ImportMetrics = {
      blueprintsProcessed: 0,
      zoneSlotsInserted: 0,
      sizeMatrixRowsInserted: 0,
    };

    // Halt transaction processing safely if the mapping engine extracted an empty file
    if (groups.size === 0) {
      this.logger.warn('No valid groups extracted from CSV data rows. Aborting database run.');
      return result;
    }

    // Initialize a TypeORM QueryRunner to process the batch inside a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const [key, groupRows] of groups.entries()) {
        const [designSlug, variantSlug] = key.split('::');

        // STEP A: Upsert into product_blueprints
        const blueprintId = await this.upsertArchetypeBlueprint(
          queryRunner,
          designSlug,
          variantSlug,
        );
        result.blueprintsProcessed++;

        // STEP B: Process the individual active components inside this blueprint group
        for (const row of groupRows) {
          const validZone = row.zone_name || row.Zone_Name || row['zone_name'];
          if (!validZone) {
            continue;
          }

          // Upsert into blueprint_zone_slots
          const slotId = await this.upsertArchetypeZoneSlot(
            queryRunner,
            blueprintId,
            row,
          );
          result.zoneSlotsInserted++;

          // STEP C: Unpivot horizontal sizing variables and save into blueprint_size_matrix
          const matrixCount = await this.upsertArchetypeSizeMatrix(
            queryRunner,
            slotId,
            row,
          );
          result.sizeMatrixRowsInserted += matrixCount;
        }
      }

      // Commit changes permanently if every loop iteration resolves flawlessly
      await queryRunner.commitTransaction();
      this.logger.log(`Archetype database transaction successfully committed. Blueprints: ${result.blueprintsProcessed}, Slots: ${result.zoneSlotsInserted}, Matrix Rows: ${result.sizeMatrixRowsInserted}`);
    } catch (err) {
      this.logger.error('Archetype data import failed, rolling back active transaction state...', err.stack);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Release the query runner connection back to the global application pool
      await queryRunner.release();
    }

    return result;
  }

  // ==========================================
  // 3. Renamed Asynchronous Stream Parser Dependency
  // ==========================================
  private async parseExcelBuffer(buffer: Buffer): Promise<ArchetypeCsvRow[]> {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1); // Assume the first sheet is the target
    const rows: ArchetypeCsvRow[] = [];

    const headers: string[] = [];
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber] = cell.value ? cell.value.toString().trim().replace(/^\ufeff/, '') : '';
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip the header row
      const rowData: ArchetypeCsvRow = {};
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber];
        if (header) {
          // Handle both simple values and potential Excel formulae/objects
          const val = cell.value && typeof cell.value === 'object' && 'result' in cell.value 
            ? cell.value.result 
            : cell.value;
          rowData[header] = val;
        }
      });
      rows.push(rowData);
    });

    return rows;
  }

  convertCsvToObjects(buffer: Buffer): Promise<ArchetypeCsvRow[]> {
    const Readable = require('stream').Readable;
    const csv = require('csv-parser');

    return new Promise((resolve, reject) => {
      const results: ArchetypeCsvRow[] = [];

      Readable.from(buffer)
        .pipe(csv({
          mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, ''),
        }))
        .on('data', (data: ArchetypeCsvRow) => results.push(data))
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error: any) => {
          reject(error);
        });
    });
  }

  // ==========================================
  // 4. Database Helper Utilities
  // ==========================================
  async upsertArchetypeBlueprint(
    queryRunner: any,
    designSlug: string,
    variantName: string,
  ): Promise<number> {
    const sql = `
    INSERT INTO product_blueprints (design_slug, variant_name, target_gender)
    VALUES ($1, $2, $3)
    ON CONFLICT (design_slug, variant_name, target_gender)
    DO UPDATE SET variant_name = EXCLUDED.variant_name
    RETURNING id;
  `;
    const res = await queryRunner.query(sql, [designSlug.trim(), variantName.trim(), 'Women']);
    return res[0].id;
  }

  async upsertArchetypeZoneSlot(
    queryRunner: any,
    blueprintId: number,
    row: ArchetypeCsvRow,
  ): Promise<number> {
    const zoneName = (row.zone_name || row.Zone_Name || row['zone_name']).trim();
    const shapeNormalized = (row.shape_normalized || row.Shape_Normalized || row['shape_normalized'] || 'round').trim().toLowerCase();
    const dimL = row.dim_l_mm || row.dim_l || '0';
    const dimW = row.dim_w_mm || row.dim_w || '0';
    const qtyModel = row.qty_model || row.Qty_Model || '';

    const templateId = `TPL-${zoneName}-${shapeNormalized}-${dimL}x${dimW}`;
    const isDynamic = qtyModel.trim() === 'CIRCUMFERENCE_BASED';

    const rawFixedQty = row.qty_7_0 || row['qty_7_0'] || row.qty_70 || '0';
    const fixedQty = isDynamic ? null : parseInt(rawFixedQty, 10);

    const sql = `
    INSERT INTO blueprint_zone_slots 
      (blueprint_id, zone_name, template_id, is_dynamic_by_size, fixed_quantity)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (blueprint_id, zone_name)
    DO UPDATE SET
      template_id = EXCLUDED.template_id,
      is_dynamic_by_size = EXCLUDED.is_dynamic_by_size,
      fixed_quantity = EXCLUDED.fixed_quantity
    RETURNING id;
  `;

    const res = await queryRunner.query(sql, [
      blueprintId,
      zoneName,
      templateId,
      isDynamic,
      fixedQty,
    ]);

    return res[0].id;
  }

  async upsertArchetypeSizeMatrix(
    queryRunner: any,
    zoneSlotId: number,
    row: ArchetypeCsvRow,
  ): Promise<number> {
    const sizes = [
      '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5',
      '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '11.5', '12.0', '12.5', '13.0'
    ];

    let insertedCount = 0;

    for (const size of sizes) {
      const colSuffix = size.replace('.', '_');
      const qtyKey = `qty_${colSuffix}`;
      const wtKey = `metal_wt_${colSuffix}`;

      const rawQty = row[qtyKey] || row[qtyKey.toUpperCase()] || '0';
      const rawWt = row[wtKey] || row[wtKey.toUpperCase()] || '0';

      const qty = parseInt(rawQty, 10);
      const metalWt = parseFloat(rawWt);

      if (qty > 0 || metalWt > 0) {
        const sql = `
        INSERT INTO blueprint_size_matrix 
          (zone_slot_id, ring_size, stone_quantity, metal_weight)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (zone_slot_id, ring_size)
        DO UPDATE SET
          stone_quantity = EXCLUDED.stone_quantity,
          metal_weight = EXCLUDED.metal_weight;
      `;

        await queryRunner.query(sql, [
          zoneSlotId,
          parseFloat(size),
          qty,
          metalWt
        ]);

        insertedCount++;
      }
    }

    return insertedCount;
  }
}
