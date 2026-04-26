import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInventoryFieldsAndBarcodesTable1776510300000
  implements MigrationInterface
{
  name = 'AddInventoryFieldsAndBarcodesTable1776510300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add enums
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'material_request_type_enum') THEN
          CREATE TYPE "material_request_type_enum" AS ENUM (
            'purchase', 'material_transfer', 'material_issue', 'manufacture', 'customer_provided'
          );
        END IF;
      END $$
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'valuation_method_enum') THEN
          CREATE TYPE "valuation_method_enum" AS ENUM (
            'fifo', 'moving_average', 'lifo'
          );
        END IF;
      END $$
    `);

    // Add inventory columns to item table
    await queryRunner.query(`
      ALTER TABLE "item"
        ADD COLUMN "shelf_life_in_days" integer NOT NULL DEFAULT 0,
        ADD COLUMN "warranty_period_in_days" integer,
        ADD COLUMN "end_of_life" date NOT NULL DEFAULT '2099-12-31',
        ADD COLUMN "weight_per_unit" numeric(10,3) NOT NULL DEFAULT '0',
        ADD COLUMN "weight_uom_id" integer,
        ADD COLUMN "default_material_request_type" "material_request_type_enum" NOT NULL DEFAULT 'purchase',
        ADD COLUMN "valuation_method" "valuation_method_enum",
        ADD COLUMN "allow_negative_stock" boolean NOT NULL DEFAULT false
    `);

    await queryRunner.query(`
      ALTER TABLE "item"
        ADD CONSTRAINT "FK_item_weight_uom"
          FOREIGN KEY ("weight_uom_id") REFERENCES "uom"("id") ON DELETE SET NULL
    `);

    // Create item_barcode table
    await queryRunner.query(`
      CREATE TABLE "item_barcode" (
        "id" SERIAL NOT NULL,
        "item_id" integer NOT NULL,
        "barcode" character varying(255) NOT NULL,
        "barcode_type" character varying(100),
        "uom_id" integer,
        CONSTRAINT "PK_item_barcode" PRIMARY KEY ("id"),
        CONSTRAINT "FK_item_barcode_item"
          FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_item_barcode_uom"
          FOREIGN KEY ("uom_id") REFERENCES "uom"("id") ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item_barcode"`);
    await queryRunner.query(`
      ALTER TABLE "item"
        DROP CONSTRAINT "FK_item_weight_uom",
        DROP COLUMN "shelf_life_in_days",
        DROP COLUMN "warranty_period_in_days",
        DROP COLUMN "end_of_life",
        DROP COLUMN "weight_per_unit",
        DROP COLUMN "weight_uom_id",
        DROP COLUMN "default_material_request_type",
        DROP COLUMN "valuation_method",
        DROP COLUMN "allow_negative_stock"
    `);
    await queryRunner.query(`DROP TYPE "valuation_method_enum"`);
    await queryRunner.query(`DROP TYPE "material_request_type_enum"`);
  }
}
