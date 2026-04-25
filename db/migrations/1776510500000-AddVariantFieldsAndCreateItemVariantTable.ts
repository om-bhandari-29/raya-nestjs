import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVariantFieldsAndCreateItemVariantTable1776510500000
  implements MigrationInterface
{
  name = 'AddVariantFieldsAndCreateItemVariantTable1776510500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add variant/weight fields to item table
    await queryRunner.query(`
      ALTER TABLE "item"
        ADD COLUMN "stones" character varying(255),
        ADD COLUMN "gross_weight" numeric(10,3) NOT NULL DEFAULT '0',
        ADD COLUMN "net_weight" numeric(10,3) NOT NULL DEFAULT '0',
        ADD COLUMN "stones_weight_in_gram" numeric(10,3) NOT NULL DEFAULT '0',
        ADD COLUMN "stone_carat_wt" numeric(10,3) NOT NULL DEFAULT '0',
        ADD COLUMN "pure_weight_metal" numeric(10,3) NOT NULL DEFAULT '0',
        ADD COLUMN "labor_rate" numeric(10,2) NOT NULL DEFAULT '0'
    `);

    // Create item_variant table
    await queryRunner.query(`
      CREATE TABLE "item_variant" (
        "id" SERIAL NOT NULL,
        "item_id" integer NOT NULL,
        "variant_of_id" integer,
        "attribute_id" integer NOT NULL,
        "value_id" integer NOT NULL,
        "is_disabled" boolean NOT NULL DEFAULT false,
        "stone_family" character varying(255),
        "stone_id" character varying(255),
        CONSTRAINT "PK_item_variant" PRIMARY KEY ("id"),
        CONSTRAINT "FK_item_variant_item"
          FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_item_variant_variant_of"
          FOREIGN KEY ("variant_of_id") REFERENCES "item"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_item_variant_attribute"
          FOREIGN KEY ("attribute_id") REFERENCES "item_attribute_master"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_item_variant_value"
          FOREIGN KEY ("value_id") REFERENCES "item_attribute_value"("id") ON DELETE RESTRICT
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item_variant"`);
    await queryRunner.query(`
      ALTER TABLE "item"
        DROP COLUMN "stones",
        DROP COLUMN "gross_weight",
        DROP COLUMN "net_weight",
        DROP COLUMN "stones_weight_in_gram",
        DROP COLUMN "stone_carat_wt",
        DROP COLUMN "pure_weight_metal",
        DROP COLUMN "labor_rate"
    `);
  }
}
