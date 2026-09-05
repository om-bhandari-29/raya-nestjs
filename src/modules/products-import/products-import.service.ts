import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { BlueprintListItemDto } from './dto/blueprint-list.dto';
import { ProductVariantsResponseDto } from './dto/product-variants.dto';
import { VariantDetailResponseDto } from './dto/product-detail.dto';
import {
  UpdateZoneSlotConfigDto,
  UpdateZoneSlotResponseDto,
} from './dto/update-zone-slot.dto';
import {
  UpdateVariantDto,
  UpdateVariantResponseDto,
} from './dto/update-variant.dto';
import {
  CreateVariantDto,
  CreateVariantResponseDto,
} from './dto/create-variant.dto';
import {
  BulkCreateVariantsDto,
  BulkCreateVariantsResponseDto,
} from './dto/bulk-create-variants.dto';
import {
  CreateZoneSlotConfigDto,
  CreateZoneSlotResponseDto,
} from './dto/create-zone-slot.dto';
import {
  VariantAllowedMetalsResponseDto,
  UpdateVariantAllowedMetalsDto,
  UpdateVariantAllowedMetalsResponseDto,
} from './dto/variant-allowed-metals.dto';
import {
  VariantMetalWeightMatrixBaseDto,
  VariantMetalWeightMatrixDto,
  VariantMetalWeightMatrixPostBaseDto,
} from './dto/variant-metal-weight-matrix.dto';

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
@Injectable()
export class ProductsImportService {
  private readonly logger = new Logger(ProductsImportService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

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
    // 1. Upsert product design
    const designSql = `
      INSERT INTO product_designs (design_slug)
      VALUES ($1)
      ON CONFLICT (design_slug)
      DO NOTHING
      RETURNING id
    `;
    const designRows = await this.dataSource.query(designSql, [designSlug]);
    let designId: number;
    if (designRows && designRows.length > 0) {
      designId = designRows[0].id;
    } else {
      const selectRes = await this.dataSource.query(
        `SELECT id FROM product_designs WHERE design_slug = $1`,
        [designSlug],
      );
      designId = selectRes[0].id;
    }

    // 2. Upsert product blueprint (variant)
    const sql = `
      INSERT INTO product_blueprints (design_id, variant_name, target_gender)
      VALUES ($1, $2, $3)
      ON CONFLICT (design_id, variant_name, target_gender)
      DO UPDATE SET
        variant_name  = EXCLUDED.variant_name,
        target_gender = EXCLUDED.target_gender
      RETURNING id
    `;

    const rows: Array<{ id: number }> = await this.dataSource.query(sql, [
      designId,
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

    // Extract shape and dimension for this zone
    const shapeCol = `${zone}_Shape`;
    const dimCol = `${zone}_Dim`;
    const shapeRaw =
      (templateRow[shapeCol] ?? 'round').toString().trim().toLowerCase() ||
      'round';
    const dimRaw = (templateRow[dimCol] ?? '').toString().trim();

    // dim may be formatted as "LxW" e.g. "5.2x3.1" or a single value
    let dimLVal: number | null = null;
    let dimWVal: number | null = null;
    if (dimRaw) {
      const parts = dimRaw.split(/[xX×]/);
      dimLVal = parts[0] ? parseFloat(parts[0]) : null;
      dimWVal = parts[1] ? parseFloat(parts[1]) : dimLVal; // square if only one value
    }

    // Analyse whether the qty fluctuates across different ring sizes
    const { isDynamic, fixedQty } = this.analyseZoneDynamism(
      activeRows,
      qtyCol,
    );

    // ── Upsert the zone slot ──────────────────────────────────────────────────
    const slotSql = `
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
      RETURNING id
    `;

    const slotRows: Array<{ id: number }> = await this.dataSource.query(
      slotSql,
      [
        blueprintId,
        zone,
        shapeRaw,
        dimLVal,
        dimWVal,
        templateId,
        isDynamic,
        isDynamic ? null : fixedQty,
      ],
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
      SELECT 
        pb.id,
        pb.design_id,
        pd.design_slug,
        pb.variant_name,
        pb.target_gender
      FROM (
        SELECT DISTINCT ON (design_id) 
          id, design_id, variant_name, target_gender
        FROM product_blueprints
        ORDER BY design_id, id DESC
      ) pb
      INNER JOIN product_designs pd ON pb.design_id = pd.id
      ORDER BY pb.id DESC
    `;
    return await this.dataSource.query(sql);
  }

  async getProductDetails(designId: number) {
    // STEP 1: Query ALL Core Product Blueprint Variants for the ID
    const blueprints = await this.dataSource.query(
      `SELECT pb.id, pb.variant_name, pb.target_gender, pd.design_slug, labour_cost_in_inr, labour_cost_in_usd
      FROM product_blueprints pb
      INNER JOIN product_designs pd ON pb.design_id = pd.id
      WHERE pb.design_id = $1`,
      [designId],
    );

    if (!blueprints || blueprints.length === 0) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException(
        'No product blueprints found for this design ID',
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

    // Query design_variant_allowed_metals table for all fetched blueprints
    const allDesignVariantAllowedMetals = await this.dataSource.query(
      `SELECT 
        dvam.variant_id, 
        dvam.metal_purity_id, 
        mp.name AS metal_purity_name,
        mp.purity_code,
        mp.metal_type
       FROM design_variant_allowed_metals dvam
       LEFT JOIN metal_purities mp ON dvam.metal_purity_id = mp.id
       WHERE dvam.variant_id = ANY($1)`,
      [blueprintIds],
    );

    // STEP 3: Query Active Structural Zone Slots for all fetched blueprints
    const allZoneSlots = await this.dataSource.query(
      `SELECT id as zone_slot_id, blueprint_id, zone_name, shape_normalized, dim_l_mm, dim_w_mm, template_id, is_dynamic_by_size, fixed_quantity 
      FROM blueprint_zone_slots 
      WHERE blueprint_id = ANY($1)`,
      [blueprintIds],
    ); // STEP 4: Resolve Sizing Sub-Matrix Array if any slot is dynamic
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
        shape_normalized: slot.shape_normalized,
        dim_l_mm: slot.dim_l_mm,
        dim_w_mm: slot.dim_w_mm,
        is_dynamic_by_size: slot.is_dynamic_by_size,
        fixed_quantity:
          slot.fixed_quantity !== null ? Number(slot.fixed_quantity) : null,
        size_wt_matrix: slot.is_dynamic_by_size
          ? allMatrices
              .filter((m) => m.zone_slot_id === slot.zone_slot_id)
              .map(({ ring_size, stone_quantity }) => ({
                ring_size,
                stone_quantity,
              }))
          : null,
      };
    });

    // STEP 5.5: Fetch metal weight matrices for all fetched blueprints
    const allWeightMatrices = await this.dataSource.query(
      `SELECT variant_id, ring_size, base_metal_weight_gm
       FROM metal_weight_matrix
       WHERE variant_id = ANY($1)
       ORDER BY ring_size ASC`,
      [blueprintIds],
    );

    // Zone name to RingComponentZone key mapping
    const zoneKeyMap: Record<string, string> = {
      CENTER: 'ZONE_CENTER',
      HALO: 'ZONE_HALO',
      GALLERY: 'ZONE_GALLERY',
      SHANK: 'ZONE_SHANK',
      ACCENT: 'ZONE_ACCENT',
      ZONE_CENTER: 'ZONE_CENTER',
      ZONE_HALO: 'ZONE_HALO',
      ZONE_GALLERY: 'ZONE_GALLERY',
      ZONE_SHANK: 'ZONE_SHANK',
      ZONE_ACCENT: 'ZONE_ACCENT',
    };

    // All zone keys — always present in response even if empty
    const allZoneKeys = [
      'ZONE_CENTER',
      'ZONE_HALO',
      'ZONE_GALLERY',
      'ZONE_SHANK',
      'ZONE_ACCENT',
    ];

    // STEP 6: Assemble the final nested structure per variant
    const variantsData = blueprints.map((blueprint) => {
      console.log(blueprint);
      const allowedMetals = allMetalOptions
        .filter((m) => m.blueprint_id === blueprint.id)
        .map(({ metal_purity, metal_color }) => ({
          metal_purity_id: metal_purity,
          metal_type: metal_color,
        }));

      // Build zone_slots as an object keyed by RingComponentZone
      const blueprintSlots = slotsWithMatrix.filter(
        (slot) => slot.blueprint_id === blueprint.id,
      );

      const zoneSlots: Record<string, any[]> = {};
      for (const key of allZoneKeys) {
        zoneSlots[key] = [];
      }

      for (const slot of blueprintSlots) {
        const zoneKey = zoneKeyMap[slot.zone_name] || slot.zone_name;
        if (!zoneSlots[zoneKey]) {
          zoneSlots[zoneKey] = [];
        }
        const { blueprint_id, zone_name, ...slotData } = slot;
        zoneSlots[zoneKey].push(slotData);
      }

      // Group design_variant_allowed_metals by metal_type
      const typeIds = [
        ...new Set(
          allDesignVariantAllowedMetals
            .filter((m) => m.variant_id === blueprint.id)
            .map((m) => m.metal_type),
        ),
      ];
      const designVariantAllowedMetals = typeIds.map((typeId) => {
        const matchingRows = allDesignVariantAllowedMetals.filter(
          (m) => m.variant_id === blueprint.id && m.metal_type === typeId,
        );

        const allowedPurities = matchingRows.map((m) => ({
          metal_purity_id: m.metal_purity_id,
          metal_purity_name: m.metal_purity_name || '',
          purity_code: m.purity_code || '',
        }));

        return {
          metal_type: typeId,
          allowed_metal_purities_id: allowedPurities,
        };
      });
      const weightMatrix = allWeightMatrices
        .filter((wm) => wm.variant_id === blueprint.id)
        .map(({ ring_size, base_metal_weight_gm }) => ({
          ring_size,
          base_metal_weight_gm:
            base_metal_weight_gm !== null ? Number(base_metal_weight_gm) : 0,
        }));

      return {
        variantId: blueprint.id,
        variant: blueprint.variant_name,
        gender: blueprint.target_gender,
        allowed_metals: allowedMetals,
        design_variant_allowed_metals: designVariantAllowedMetals,
        zone_slots: zoneSlots,
        weight_matrix: weightMatrix,
        labour_costs: {
          labour_cost_in_inr: blueprint.labour_cost_in_inr
            ? Number(blueprint.labour_cost_in_inr)
            : 0,
          labour_cost_in_usd: blueprint.labour_cost_in_usd
            ? Number(blueprint.labour_cost_in_usd)
            : 0,
        },
      };
    });

    const designSlug = blueprints[0]?.design_slug || '';

    return {
      success: true,
      data: {
        design_slug: designSlug,
        variants: variantsData,
      },
    };
  }

  async getVariantsByDesign(
    designId: number,
  ): Promise<ProductVariantsResponseDto> {
    const blueprints = await this.dataSource.query(
      `SELECT pb.id, pb.variant_name, pb.target_gender, pd.design_slug 
       FROM product_blueprints pb
       INNER JOIN product_designs pd ON pb.design_id = pd.id
       WHERE pb.design_id = $1`,
      [designId],
    );

    if (!blueprints || blueprints.length === 0) {
      const designExists = await this.dataSource.query(
        `SELECT design_slug FROM product_designs WHERE id = $1`,
        [designId],
      );
      if (!designExists || designExists.length === 0) {
        const { NotFoundException } = await import('@nestjs/common');
        throw new NotFoundException('No design found for this design ID');
      }
      return {
        status: true,
        design_slug: designExists[0].design_slug,
        data: [],
      };
    }

    const designSlug = blueprints[0].design_slug;

    const variants = blueprints.map((blueprint) => ({
      variantId: blueprint.id,
      variant_name: blueprint.variant_name,
      target_gender: blueprint.target_gender,
    }));

    return {
      status: true,
      design_slug: designSlug,
      data: variants,
    };
  }

  async getMetalWeightMatrix(
    variantId: number,
  ): Promise<VariantMetalWeightMatrixBaseDto> {
    const blueprints = await this.dataSource.query(
      `SELECT ring_size, base_metal_weight_gm
       FROM metal_weight_matrix
       WHERE variant_id = $1
       ORDER BY ring_size ASC`,
      [variantId],
    );
    return {
      status: true,
      message: 'Successfully fetched metal weight matrix for the variant',
      data: blueprints,
    };
  }

  async postMetalWeightMatrix(
    variantId: number,
    weightMatrix: VariantMetalWeightMatrixDto[],
  ): Promise<VariantMetalWeightMatrixPostBaseDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Delete existing matrix for this variant
      await queryRunner.query(
        `
      DELETE FROM metal_weight_matrix
      WHERE variant_id = $1
      `,
        [variantId],
      );

      // 2. Insert the new matrix
      if (weightMatrix.length > 0) {
        const values: any[] = [];
        const placeholders: string[] = [];

        weightMatrix.forEach((item, index) => {
          const baseIndex = index * 3;

          placeholders.push(
            `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`,
          );

          values.push(variantId, item.ring_size, item.base_metal_weight_gm);
        });

        await queryRunner.query(
          `
        INSERT INTO metal_weight_matrix
          (variant_id, ring_size, base_metal_weight_gm)
        VALUES ${placeholders.join(', ')}
        `,
          values,
        );
      }

      // 3. Commit transaction
      await queryRunner.commitTransaction();

      return {
        status: true,
        message: 'Metal weight matrix successfully updated for the variant',
        data: null,
      };
    } catch (error) {
      // Rollback if either DELETE or INSERT fails
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getVariantDetails(
    variantId: number,
  ): Promise<VariantDetailResponseDto> {
    // STEP 1: Check if the blueprint variant actually exists
    const blueprints = await this.dataSource.query(
      `SELECT id, variant_name, target_gender, labour_cost_in_inr, labour_cost_in_usd
       FROM product_blueprints 
       WHERE id = $1`,
      [variantId],
    );

    if (!blueprints || blueprints.length === 0) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException(
        'No product blueprint found for this variant ID',
      );
    }

    // STEP 2: Query Permitted Metal Options for the blueprint ID
    const metalOptions = await this.dataSource.query(
      `SELECT metal_purity, metal_color 
       FROM product_metal_options 
       WHERE blueprint_id = $1`,
      [variantId],
    );

    // Query design_variant_allowed_metals for the variant ID
    const designVariantAllowedMetalsRaw = await this.dataSource.query(
      `SELECT 
        dvam.metal_purity_id, 
        mp.name AS metal_purity_name,
        mp.purity_code,
        mp.metal_type
       FROM design_variant_allowed_metals dvam
       LEFT JOIN metal_purities mp ON dvam.metal_purity_id = mp.id
       WHERE dvam.variant_id = $1`,
      [variantId],
    );

    // STEP 3: Query Active Structural Zone Slots for the blueprint ID
    const zoneSlotsQuery = await this.dataSource.query(
      `SELECT id as zone_slot_id, zone_name, shape_normalized, dim_l_mm, dim_w_mm, template_id, is_dynamic_by_size, fixed_quantity 
       FROM blueprint_zone_slots 
       WHERE blueprint_id = $1`,
      [variantId],
    ); // STEP 4: Resolve Sizing Sub-Matrix Array if any slot is dynamic
    const dynamicZoneSlotIds = zoneSlotsQuery
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
    const slotsWithMatrix = zoneSlotsQuery.map((slot) => {
      return {
        zone_slot_id: slot.zone_slot_id,
        zone_name: slot.zone_name,
        shape_normalized: slot.shape_normalized,
        dim_l_mm: slot.dim_l_mm,
        dim_w_mm: slot.dim_w_mm,
        is_dynamic_by_size: slot.is_dynamic_by_size,
        fixed_quantity:
          slot.fixed_quantity !== null ? Number(slot.fixed_quantity) : null,
        size_wt_matrix: slot.is_dynamic_by_size
          ? allMatrices
              .filter((m) => m.zone_slot_id === slot.zone_slot_id)
              .map(({ ring_size, stone_quantity }) => ({
                ring_size,
                stone_quantity,
              }))
          : null,
      };
    });

    // STEP 5.5: Fetch metal weight matrix for the variant
    const weightMatrix = await this.dataSource.query(
      `SELECT ring_size, base_metal_weight_gm
       FROM metal_weight_matrix
       WHERE variant_id = $1
       ORDER BY ring_size ASC`,
      [variantId],
    );

    // Zone name to RingComponentZone key mapping
    const zoneKeyMap: Record<string, string> = {
      CENTER: 'ZONE_CENTER',
      HALO: 'ZONE_HALO',
      GALLERY: 'ZONE_GALLERY',
      SHANK: 'ZONE_SHANK',
      ACCENT: 'ZONE_ACCENT',
      ZONE_CENTER: 'ZONE_CENTER',
      ZONE_HALO: 'ZONE_HALO',
      ZONE_GALLERY: 'ZONE_GALLERY',
      ZONE_SHANK: 'ZONE_SHANK',
      ZONE_ACCENT: 'ZONE_ACCENT',
    };

    // All zone keys — always present in response even if empty
    const allZoneKeys = [
      'ZONE_CENTER',
      'ZONE_HALO',
      'ZONE_GALLERY',
      'ZONE_SHANK',
      'ZONE_ACCENT',
    ];

    const zoneSlots: Record<string, any[]> = {};
    for (const key of allZoneKeys) {
      zoneSlots[key] = [];
    }

    for (const slot of slotsWithMatrix) {
      const zoneKey = zoneKeyMap[slot.zone_name] || slot.zone_name;
      if (!zoneSlots[zoneKey]) {
        zoneSlots[zoneKey] = [];
      }
      const { zone_name, ...slotData } = slot;
      zoneSlots[zoneKey].push(slotData);
    }
    return {
      status: true,
      data: {
        variantId,
        allowed_metals: metalOptions.map(({ metal_purity, metal_color }) => ({
          metal_purity_id: metal_purity,
          metal_type: metal_color,
        })),
        design_variant_allowed_metals: (() => {
          const typeIds = [
            ...new Set<number>(
              designVariantAllowedMetalsRaw.map((m) => m.metal_type),
            ),
          ];
          return typeIds.map((typeId) => {
            const matchingRows = designVariantAllowedMetalsRaw.filter(
              (m) => m.metal_type === typeId,
            );

            const allowedPurities = matchingRows.map((m) => ({
              metal_purity_id: m.metal_purity_id,
              metal_purity_name: m.metal_purity_name || '',
              purity_code: m.purity_code || '',
            }));

            return {
              metal_type: typeId,
              allowed_metal_purities_id: allowedPurities,
            };
          });
        })(),
        zone_slots: zoneSlots as any,
        weight_matrix: weightMatrix.map(
          ({ ring_size, base_metal_weight_gm }) => ({
            ring_size: Number(ring_size),
            base_metal_weight_gm:
              base_metal_weight_gm !== null ? Number(base_metal_weight_gm) : 0,
          }),
        ),
        labour_costs: {
          labour_cost_in_inr: blueprints[0].labour_cost_in_inr
            ? Number(blueprints[0].labour_cost_in_inr)
            : 0,
          labour_cost_in_usd: blueprints[0].labour_cost_in_usd
            ? Number(blueprints[0].labour_cost_in_usd)
            : 0,
        },
      },
    };
  }

  async updateZoneSlotConfig(
    dto: UpdateZoneSlotConfigDto,
  ): Promise<UpdateZoneSlotResponseDto> {
    const {
      zone_slot_id,
      shape_normalized,
      dim_l_mm,
      dim_w_mm,
      is_dynamic_by_size,
      size_wt_matrix,
      fixed_quantity,
    } = dto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Verify existence of the zone slot
      const existingSlots = await queryRunner.query(
        `SELECT id, is_dynamic_by_size FROM blueprint_zone_slots WHERE id = $1`,
        [zone_slot_id],
      );

      if (!existingSlots || existingSlots.length === 0) {
        const { NotFoundException } = await import('@nestjs/common');
        throw new NotFoundException(
          `Zone slot with ID ${zone_slot_id} not found`,
        );
      }

      // Determine fixed quantity based on is_dynamic_by_size
      let finalFixedQty: number | null = null;
      if (!is_dynamic_by_size) {
        if (fixed_quantity === undefined || fixed_quantity === null) {
          const { BadRequestException } = await import('@nestjs/common');
          throw new BadRequestException(
            'fixed_quantity must be provided when is_dynamic_by_size is false',
          );
        }
        finalFixedQty = fixed_quantity;
      } else {
        if (
          is_dynamic_by_size &&
          (!size_wt_matrix || size_wt_matrix.length === 0)
        ) {
          const { BadRequestException } = await import('@nestjs/common');
          throw new BadRequestException(
            'size_wt_matrix must be provided when is_dynamic_by_size is true',
          );
        }
        finalFixedQty = null;
      }

      // 2. Update blueprint_zone_slots
      await queryRunner.query(
        `UPDATE blueprint_zone_slots 
         SET shape_normalized = $1,
             dim_l_mm = $2,
             dim_w_mm = $3,
             is_dynamic_by_size = $4,
             fixed_quantity = $5
         WHERE id = $6`,
        [
          shape_normalized,
          dim_l_mm,
          dim_w_mm,
          is_dynamic_by_size,
          finalFixedQty,
          zone_slot_id,
        ],
      );

      // 3. Update blueprint_size_matrix
      // Always clean up existing entries to avoid orphaned/unwanted rows
      await queryRunner.query(
        `DELETE FROM blueprint_size_matrix WHERE zone_slot_id = $1`,
        [zone_slot_id],
      );

      // If dynamic, insert the new entries
      if (is_dynamic_by_size && size_wt_matrix && size_wt_matrix.length > 0) {
        const insertSql = `
          INSERT INTO blueprint_size_matrix (zone_slot_id, ring_size, stone_quantity)
          VALUES ($1, $2, $3)
          ON CONFLICT (zone_slot_id, ring_size)
          DO UPDATE SET stone_quantity = EXCLUDED.stone_quantity
        `;

        for (const entry of size_wt_matrix) {
          const ringSizeNum = parseFloat(entry.ring_size);
          if (isNaN(ringSizeNum)) {
            const { BadRequestException } = await import('@nestjs/common');
            throw new BadRequestException(
              `Invalid ring size value: "${entry.ring_size}"`,
            );
          }
          await queryRunner.query(insertSql, [
            zone_slot_id,
            ringSizeNum,
            entry.stone_quantity,
          ]);
        }
      }

      await queryRunner.commitTransaction();

      return {
        status: true,
        message: 'Zone slot configuration updated successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createZoneSlotConfig(
    dto: CreateZoneSlotConfigDto,
  ): Promise<CreateZoneSlotResponseDto> {
    const {
      variant_id,
      zone,
      shape_normalized,
      dim_l_mm,
      dim_w_mm,
      is_dynamic_by_size,
      size_wt_matrix,
      fixed_quantity,
    } = dto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Verify existence of the variant (blueprint_id)
      const blueprints = await queryRunner.query(
        `SELECT id FROM product_blueprints WHERE id = $1`,
        [variant_id],
      );

      if (!blueprints || blueprints.length === 0) {
        const { NotFoundException } = await import('@nestjs/common');
        throw new NotFoundException(
          `Variant (Blueprint) with ID ${variant_id} not found`,
        );
      }

      // 2. Check for unique constraint: blueprint_id, zone_name, shape_normalized
      const existingSlots = await queryRunner.query(
        `SELECT id FROM blueprint_zone_slots WHERE blueprint_id = $1 AND zone_name = $2 AND shape_normalized = $3`,
        [variant_id, zone, shape_normalized],
      );

      if (existingSlots && existingSlots.length > 0) {
        const { ConflictException } = await import('@nestjs/common');
        throw new ConflictException(
          `A zone slot configuration for variant ${variant_id}, zone "${zone}", and shape "${shape_normalized}" already exists`,
        );
      }

      // Determine fixed quantity based on is_dynamic_by_size
      let finalFixedQty: number | null = null;
      if (!is_dynamic_by_size) {
        if (fixed_quantity === undefined || fixed_quantity === null) {
          const { BadRequestException } = await import('@nestjs/common');
          throw new BadRequestException(
            'fixed_quantity must be provided when is_dynamic_by_size is false',
          );
        }
        finalFixedQty = fixed_quantity;
      } else {
        if (
          is_dynamic_by_size &&
          (!size_wt_matrix || size_wt_matrix.length === 0)
        ) {
          const { BadRequestException } = await import('@nestjs/common');
          throw new BadRequestException(
            'size_wt_matrix must be provided when is_dynamic_by_size is true',
          );
        }
        finalFixedQty = null;
      }

      // Generate template_id automatically: TPL-${zone}-${shape_normalized}-${dimL}x${dimW}
      const dimL = dim_l_mm ?? 0;
      const dimW = dim_w_mm ?? 0;
      const templateId = `TPL-${zone}-${shape_normalized}-${dimL}x${dimW}`;

      // 3. Insert into blueprint_zone_slots
      const insertSlotRes = await queryRunner.query(
        `INSERT INTO blueprint_zone_slots 
          (blueprint_id, zone_name, shape_normalized, dim_l_mm, dim_w_mm, template_id, is_dynamic_by_size, fixed_quantity)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          variant_id,
          zone,
          shape_normalized,
          dim_l_mm,
          dim_w_mm,
          templateId,
          is_dynamic_by_size,
          finalFixedQty,
        ],
      );

      const zoneSlotId = insertSlotRes[0].id;

      // 4. Insert size matrix if dynamic
      if (is_dynamic_by_size && size_wt_matrix && size_wt_matrix.length > 0) {
        const insertSql = `
          INSERT INTO blueprint_size_matrix (zone_slot_id, ring_size, stone_quantity)
          VALUES ($1, $2, $3)
        `;

        for (const entry of size_wt_matrix) {
          const ringSizeNum = parseFloat(entry.ring_size);
          if (isNaN(ringSizeNum)) {
            const { BadRequestException } = await import('@nestjs/common');
            throw new BadRequestException(
              `Invalid ring size value: "${entry.ring_size}"`,
            );
          }
          await queryRunner.query(insertSql, [
            zoneSlotId,
            ringSizeNum,
            entry.stone_quantity,
          ]);
        }
      }

      await queryRunner.commitTransaction();

      return {
        status: true,
        message: 'Zone slot configuration added successfully',
        data: zoneSlotId,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateVariant(
    dto: UpdateVariantDto,
  ): Promise<UpdateVariantResponseDto> {
    const {
      variant_id,
      variant_name,
      target_gender,
      labour_cost_in_inr,
      labour_cost_in_usd,
    } = dto;
    const trimmedVariantName = (variant_name ?? '').trim();
    const trimmedTargetGender = (target_gender ?? '').trim();

    if (!trimmedVariantName || !trimmedTargetGender) {
      const { BadRequestException } = await import('@nestjs/common');
      throw new BadRequestException(
        'variant_name and target_gender cannot be empty',
      );
    }

    // 1. Verify existence of the variant
    const blueprints = await this.dataSource.query(
      `SELECT pb.id, pb.design_id, pd.design_slug, pb.labour_cost_in_inr, pb.labour_cost_in_usd 
       FROM product_blueprints pb
       INNER JOIN product_designs pd ON pb.design_id = pd.id
       WHERE pb.id = $1`,
      [variant_id],
    );

    if (!blueprints || blueprints.length === 0) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException(
        `Product blueprint with variant ID ${variant_id} not found`,
      );
    }

    const designId = blueprints[0].design_id;
    const designSlug = blueprints[0].design_slug;
    const currentInr = blueprints[0].labour_cost_in_inr;
    const currentUsd = blueprints[0].labour_cost_in_usd;

    // 2. Check for unique key conflict
    const conflict = await this.dataSource.query(
      `SELECT id 
       FROM product_blueprints 
       WHERE design_id = $1 
         AND variant_name = $2 
         AND target_gender = $3 
         AND id != $4`,
      [designId, trimmedVariantName, trimmedTargetGender, variant_id],
    );

    if (conflict && conflict.length > 0) {
      const { ConflictException } = await import('@nestjs/common');
      throw new ConflictException(
        `A variant with name "${trimmedVariantName}" and target gender "${trimmedTargetGender}" already exists for design "${designSlug}"`,
      );
    }

    // 3. Update the blueprint variant
    await this.dataSource.query(
      `UPDATE product_blueprints 
       SET variant_name = $1, 
           target_gender = $2, 
           labour_cost_in_inr = $3, 
           labour_cost_in_usd = $4
       WHERE id = $5`,
      [
        trimmedVariantName,
        trimmedTargetGender,
        labour_cost_in_inr ?? currentInr,
        labour_cost_in_usd ?? currentUsd,
        variant_id,
      ],
    );

    return {
      status: true,
      message: 'Product blueprint variant updated successfully',
    };
  }

  async createVariant(
    dto: CreateVariantDto,
  ): Promise<CreateVariantResponseDto> {
    const {
      design_id,
      variant_name,
      target_gender,
      labour_costs_in_inr,
      labour_costs_in_usd,
    } = dto;
    const trimmedVariantName = (variant_name ?? '').trim();
    const trimmedTargetGender = (target_gender ?? '').trim();

    if (!design_id || !trimmedVariantName || !trimmedTargetGender) {
      const { BadRequestException } = await import('@nestjs/common');
      throw new BadRequestException(
        'design_id, variant_name, and target_gender cannot be empty',
      );
    }

    // 1. Verify product design exists
    const designRows = await this.dataSource.query(
      `SELECT id, design_slug FROM product_designs WHERE id = $1`,
      [design_id],
    );
    if (!designRows || designRows.length === 0) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException(
        `Product design with ID ${design_id} not found`,
      );
    }
    const designSlug = designRows[0].design_slug;

    // 2. Check for unique key conflict
    const conflict = await this.dataSource.query(
      `SELECT id 
       FROM product_blueprints 
       WHERE design_id = $1 
         AND variant_name = $2 
         AND target_gender = $3`,
      [design_id, trimmedVariantName, trimmedTargetGender],
    );

    if (conflict && conflict.length > 0) {
      const { ConflictException } = await import('@nestjs/common');
      throw new ConflictException(
        `A variant with name "${trimmedVariantName}" and target gender "${trimmedTargetGender}" already exists for design "${designSlug}"`,
      );
    }

    // 3. Insert the new blueprint variant
    const insertResult = await this.dataSource.query(
      `INSERT INTO product_blueprints (design_id, variant_name, target_gender, labour_cost_in_inr, labour_cost_in_usd)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        design_id,
        trimmedVariantName,
        trimmedTargetGender,
        labour_costs_in_inr ?? 0,
        labour_costs_in_usd ?? 0,
      ],
    );

    const variantId = insertResult[0].id;

    return {
      status: true,
      message: 'Product blueprint variant created successfully',
      data: variantId,
    };
  }

  // async bulkCreateVariants(
  //   dto: BulkCreateVariantsDto,
  // ): Promise<BulkCreateVariantsResponseDto> {
  //   const { design_slug, sub_category_id, variant } = dto;
  //   const trimmedDesignSlug = (design_slug ?? '').trim();

  //   if (!trimmedDesignSlug || !variant || variant.length === 0) {
  //     const { BadRequestException } = await import('@nestjs/common');
  //     throw new BadRequestException(
  //       'design_slug and variant list cannot be empty',
  //     );
  //   }

  //   // 1. Check for duplicates within the input payload itself
  //   const seen = new Set<string>();
  //   for (const v of variant) {
  //     const trimmedName = (v.variant_name ?? '').trim();
  //     const trimmedGender = (v.target_gender ?? '').trim();

  //     if (!trimmedName || !trimmedGender) {
  //       const { BadRequestException } = await import('@nestjs/common');
  //       throw new BadRequestException(
  //         'variant_name and target_gender cannot be empty for any variant',
  //       );
  //     }

  //     const key = `${trimmedName.toLowerCase()}::${trimmedGender.toLowerCase()}`;
  //     if (seen.has(key)) {
  //       const { BadRequestException } = await import('@nestjs/common');
  //       throw new BadRequestException(
  //         `Duplicate variant detected in payload: name "${trimmedName}" with target_gender "${trimmedGender}"`,
  //       );
  //     }
  //     seen.add(key);
  //   }

  //   // 2. Save them all in a transaction
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     // Find or create the design slug
  //     const designSql = `
  //       INSERT INTO product_designs (design_slug)
  //       VALUES ($1)
  //       ON CONFLICT (design_slug)
  //       DO NOTHING
  //       RETURNING id
  //     `;
  //     const designRows = await queryRunner.query(designSql, [
  //       trimmedDesignSlug,
  //     ]);
  //     let designId: number;
  //     if (designRows && designRows.length > 0) {
  //       designId = designRows[0].id;
  //     } else {
  //       const selectRes = await queryRunner.query(
  //         `SELECT id FROM product_designs WHERE design_slug = $1`,
  //         [trimmedDesignSlug],
  //       );
  //       designId = selectRes[0].id;
  //     }

  //     const insertedIds: number[] = [];
  //     for (const v of variant) {
  //       // Check database unique constraint conflict
  //       const conflict = await queryRunner.query(
  //         `SELECT id FROM product_blueprints WHERE design_id = $1 AND variant_name = $2 AND target_gender = $3`,
  //         [designId, v.variant_name.trim(), v.target_gender.trim()],
  //       );
  //       if (conflict && conflict.length > 0) {
  //         const { ConflictException } = await import('@nestjs/common');
  //         throw new ConflictException(
  //           `A variant with name "${v.variant_name.trim()}" and target gender "${v.target_gender.trim()}" already exists for design "${trimmedDesignSlug}"`,
  //         );
  //       }

  //       const res = await queryRunner.query(
  //         `INSERT INTO product_blueprints (design_id, variant_name, target_gender)
  //          VALUES ($1, $2, $3)
  //          RETURNING id`,
  //         [designId, v.variant_name.trim(), v.target_gender.trim()],
  //       );
  //       insertedIds.push(res[0].id);
  //     }

  //     await queryRunner.commitTransaction();

  //     return {
  //       status: true,
  //       message: 'Variants created successfully',
  //       data: designId,
  //     };
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async bulkCreateVariants(
    dto: BulkCreateVariantsDto,
  ): Promise<BulkCreateVariantsResponseDto> {
    const { design_slug, sub_category_id, variant } = dto;
    const trimmedDesignSlug = (design_slug ?? '').trim();

    if (!trimmedDesignSlug || !variant || variant.length === 0) {
      const { BadRequestException } = await import('@nestjs/common');
      throw new BadRequestException(
        'design_slug and variant list cannot be empty',
      );
    }

    // 1. Check for duplicates within the input payload itself
    const seen = new Set<string>();
    for (const v of variant) {
      const trimmedName = (v.variant_name ?? '').trim();
      const trimmedGender = (v.target_gender ?? '').trim();

      if (!trimmedName || !trimmedGender) {
        const { BadRequestException } = await import('@nestjs/common');
        throw new BadRequestException(
          'variant_name and target_gender cannot be empty for any variant',
        );
      }

      const key = `${trimmedName.toLowerCase()}::${trimmedGender.toLowerCase()}`;
      if (seen.has(key)) {
        const { BadRequestException } = await import('@nestjs/common');
        throw new BadRequestException(
          `Duplicate variant detected in payload: name "${trimmedName}" with target_gender "${trimmedGender}"`,
        );
      }
      seen.add(key);
    }

    // 2. Save them all in a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Optional: Verify sub_category exists before inserting/updating
      if (sub_category_id) {
        const subCat = await queryRunner.query(
          `SELECT id FROM sub_categories WHERE id = $1`,
          [sub_category_id],
        );
        if (!subCat || subCat.length === 0) {
          const { NotFoundException } = await import('@nestjs/common');
          throw new NotFoundException(
            `SubCategory with ID ${sub_category_id} not found`,
          );
        }
      }

      // Find, create, or update the design slug with sub_category_id
      const designSql = `
        INSERT INTO product_designs (design_slug, sub_category_id)
        VALUES ($1, $2)
        ON CONFLICT (design_slug)
        DO UPDATE SET sub_category_id = COALESCE(EXCLUDED.sub_category_id, product_designs.sub_category_id)
        RETURNING id
      `;
      const designRows = await queryRunner.query(designSql, [
        trimmedDesignSlug,
        sub_category_id ?? null,
      ]);

      const designId: number = designRows[0].id;

      const insertedIds: number[] = [];
      for (const v of variant) {
        // Check database unique constraint conflict
        const conflict = await queryRunner.query(
          `SELECT id FROM product_blueprints WHERE design_id = $1 AND variant_name = $2 AND target_gender = $3`,
          [designId, v.variant_name.trim(), v.target_gender.trim()],
        );
        if (conflict && conflict.length > 0) {
          const { ConflictException } = await import('@nestjs/common');
          throw new ConflictException(
            `A variant with name "${v.variant_name.trim()}" and target gender "${v.target_gender.trim()}" already exists for design "${trimmedDesignSlug}"`,
          );
        }

        const res = await queryRunner.query(
          `INSERT INTO product_blueprints (design_id, variant_name, target_gender)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [designId, v.variant_name.trim(), v.target_gender.trim()],
        );
        insertedIds.push(res[0].id);
      }

      await queryRunner.commitTransaction();

      return {
        status: true,
        message: 'Variants created successfully',
        data: designId,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllowedMetalsForVariant(
    variantId: number,
  ): Promise<VariantAllowedMetalsResponseDto> {
    // 1. Check if the blueprint variant actually exists
    const blueprints = await this.dataSource.query(
      `SELECT id FROM product_blueprints WHERE id = $1`,
      [variantId],
    );

    if (!blueprints || blueprints.length === 0) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException(
        `No product blueprint found for variant ID ${variantId}`,
      );
    }

    // 2. Query design_variant_allowed_metals table with joins for master and purity details
    const rows = await this.dataSource.query(
      `SELECT 
        dvam.metal_purity_id, 
        mp.name AS metal_purity_name,
        mp.purity_code,
        mp.percentage,
        mp.rate_per_gram_inr,
        mp.rate_per_gram_usd,
        mp.metal_type
       FROM design_variant_allowed_metals dvam
       LEFT JOIN metal_purities mp ON dvam.metal_purity_id = mp.id
       WHERE dvam.variant_id = $1`,
      [variantId],
    );

    // 3. Group allowed purity details by metal_type
    const typeIds = [...new Set<number>(rows.map((row) => row.metal_type))];
    const data = typeIds.map((typeId) => {
      const matchingRows = rows.filter((row) => row.metal_type === typeId);

      const allowedPurities = matchingRows.map((row) => ({
        metal_purity_id: row.metal_purity_id,
        metal_purity_name: row.metal_purity_name || '',
        purity_code: row.purity_code || '',
        percentage: row.percentage ? Number(row.percentage) : null,
        rate_per_gram_inr: row.rate_per_gram_inr
          ? Number(row.rate_per_gram_inr)
          : null,
        rate_per_gram_usd: row.rate_per_gram_usd
          ? Number(row.rate_per_gram_usd)
          : null,
      }));

      return {
        metal_type: typeId,
        allowed_metal_purities_id: allowedPurities,
      };
    });

    return {
      status: true,
      message: 'Allowed metals retrieved successfully',
      data,
    };
  }

  async updateAllowedMetalsForVariant(
    body: UpdateVariantAllowedMetalsDto,
  ): Promise<UpdateVariantAllowedMetalsResponseDto> {
    const { variant_id, allowed_metals } = body;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Check if the blueprint variant actually exists
      const blueprints = await queryRunner.query(
        `SELECT id FROM product_blueprints WHERE id = $1`,
        [variant_id],
      );

      if (!blueprints || blueprints.length === 0) {
        const { NotFoundException } = await import('@nestjs/common');
        throw new NotFoundException(
          `No product blueprint found for variant ID ${variant_id}`,
        );
      }

      // 2. Delete existing allowed metals for this variant
      await queryRunner.query(
        `DELETE FROM design_variant_allowed_metals WHERE variant_id = $1`,
        [variant_id],
      );

      // 3. Insert new allowed metals
      for (const metal of allowed_metals) {
        const { metal_type: metalTypeId, metal_purities: metalPurityIds } =
          metal;
        for (const purityId of metalPurityIds) {
          await queryRunner.query(
            `INSERT INTO design_variant_allowed_metals (variant_id, metal_purity_id)
             VALUES ($1, $2)
             ON CONFLICT (variant_id, metal_purity_id) DO NOTHING`,
            [variant_id, purityId],
          );
        }
      }

      await queryRunner.commitTransaction();

      return {
        status: true,
        message: 'Allowed metals updated successfully',
        data: variant_id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
