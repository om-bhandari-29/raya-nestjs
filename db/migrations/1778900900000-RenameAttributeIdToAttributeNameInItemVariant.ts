import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameAttributeIdToAttributeNameInItemVariant1778900900000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ===== item_variant table: attribute_id (int) → attribute_name (varchar) =====

    // Drop the existing FK constraint on attribute_id
    await queryRunner.query(
      `ALTER TABLE "item_variant" DROP CONSTRAINT IF EXISTS "FK_item_variant_attribute"`,
    );

    // Drop the column attribute_id and add attribute_name as varchar
    await queryRunner.query(
      `ALTER TABLE "item_variant" DROP COLUMN IF EXISTS "attribute_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ADD COLUMN IF NOT EXISTS "attribute_name" character varying(255) NOT NULL DEFAULT ''`,
    );

    // ===== item_attribute_value table: attribute_id (int) → attribute_name (varchar) =====

    // Drop the existing FK constraint on attribute_id
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" DROP CONSTRAINT IF EXISTS "FK_item_attribute_value_attribute"`,
    );

    // Drop the column attribute_id and add attribute_name as varchar
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" DROP COLUMN IF EXISTS "attribute_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" ADD COLUMN IF NOT EXISTS "attribute_name" character varying(255) NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert item_attribute_value
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" DROP COLUMN IF EXISTS "attribute_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" ADD COLUMN "attribute_id" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" ADD CONSTRAINT "FK_item_attribute_value_attribute" FOREIGN KEY ("attribute_id") REFERENCES "item_attribute_master"("id") ON DELETE CASCADE`,
    );

    // Revert item_variant
    await queryRunner.query(
      `ALTER TABLE "item_variant" DROP COLUMN IF EXISTS "attribute_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ADD COLUMN "attribute_id" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ADD CONSTRAINT "FK_item_variant_attribute" FOREIGN KEY ("attribute_id") REFERENCES "item_attribute_master"("id") ON DELETE RESTRICT`,
    );
  }
}
