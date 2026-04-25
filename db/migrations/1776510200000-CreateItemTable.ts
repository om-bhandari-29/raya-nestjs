import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateItemTable1776510200000 implements MigrationInterface {
  name = 'CreateItemTable1776510200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "item" (
        "id" SERIAL NOT NULL,
        "product_master_id" integer NOT NULL,
        "name" character varying(255) NOT NULL,
        "item_group_id" integer NOT NULL,
        "hsn_sac_id" integer,
        "default_uom_id" integer,
        "fixed_qty" numeric(10,2) NOT NULL DEFAULT '0',
        "is_disabled" boolean NOT NULL DEFAULT false,
        "allow_alternative_item" boolean NOT NULL DEFAULT false,
        "maintain_stock" boolean NOT NULL DEFAULT true,
        "is_in_stock" boolean NOT NULL DEFAULT false,
        "has_variants" boolean NOT NULL DEFAULT false,
        "estimated_delivery_days" integer NOT NULL DEFAULT 0,
        "valuation_rate" numeric(10,2) NOT NULL DEFAULT '0',
        "is_fixed_asset" boolean NOT NULL DEFAULT false,
        "over_delivery_receipt_allowance" numeric(5,3) NOT NULL DEFAULT '0',
        "over_billing_allowance" numeric(5,3) NOT NULL DEFAULT '0',
        "description" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_item" PRIMARY KEY ("id"),
        CONSTRAINT "FK_item_product_master" FOREIGN KEY ("product_master_id")
          REFERENCES "product_master"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_item_item_group" FOREIGN KEY ("item_group_id")
          REFERENCES "item_group"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_item_hsn_sac" FOREIGN KEY ("hsn_sac_id")
          REFERENCES "gst_hsn_code"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_item_default_uom" FOREIGN KEY ("default_uom_id")
          REFERENCES "uom"("id") ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item"`);
  }
}
