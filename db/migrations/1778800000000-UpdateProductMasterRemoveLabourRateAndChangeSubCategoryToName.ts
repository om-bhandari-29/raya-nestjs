import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductMasterRemoveLabourRateAndChangeSubCategoryToName1778800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop FK constraint on sub_category_id
    await queryRunner.query(`
      ALTER TABLE "product_master"
      DROP CONSTRAINT IF EXISTS "FK_product_master_sub_category_id"
    `);

    // Add sub_category_name column
    await queryRunner.query(`
      ALTER TABLE "product_master"
      ADD COLUMN "sub_category_name" varchar(100)
    `);

    // Migrate existing data: populate sub_category_name from sub_category table
    await queryRunner.query(`
      UPDATE "product_master" pm
      SET "sub_category_name" = sc."name"
      FROM "sub_category" sc
      WHERE pm."sub_category_id" = sc."id"
    `);

    // Make sub_category_name NOT NULL after data migration
    await queryRunner.query(`
      ALTER TABLE "product_master"
      ALTER COLUMN "sub_category_name" SET NOT NULL
    `);

    // Add FK from sub_category_name -> sub_category.name
    await queryRunner.query(`
      ALTER TABLE "product_master"
      ADD CONSTRAINT "FK_product_master_sub_category_name"
      FOREIGN KEY ("sub_category_name") REFERENCES "sub_category"("name")
      ON UPDATE CASCADE ON DELETE RESTRICT
    `);

    // Drop old sub_category_id column
    await queryRunner.query(`
      ALTER TABLE "product_master"
      DROP COLUMN "sub_category_id"
    `);

    // Drop labour_rate and labour_rate_on columns
    await queryRunner.query(`
      ALTER TABLE "product_master"
      DROP COLUMN "labour_rate"
    `);

    await queryRunner.query(`
      ALTER TABLE "product_master"
      DROP COLUMN "labour_rate_on"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-add labour_rate and labour_rate_on
    await queryRunner.query(`
      ALTER TABLE "product_master"
      ADD COLUMN "labour_rate" varchar(50) NOT NULL DEFAULT ''
    `);

    await queryRunner.query(`
      CREATE TYPE "labour_rate_on_enum" AS ENUM ('Net', 'Gross', 'Other')
    `);

    await queryRunner.query(`
      ALTER TABLE "product_master"
      ADD COLUMN "labour_rate_on" "labour_rate_on_enum" NOT NULL DEFAULT 'Net'
    `);

    // Re-add sub_category_id
    await queryRunner.query(`
      ALTER TABLE "product_master"
      ADD COLUMN "sub_category_id" int
    `);

    // Migrate data back
    await queryRunner.query(`
      UPDATE "product_master" pm
      SET "sub_category_id" = sc."id"
      FROM "sub_category" sc
      WHERE pm."sub_category_name" = sc."name"
    `);

    await queryRunner.query(`
      ALTER TABLE "product_master"
      ALTER COLUMN "sub_category_id" SET NOT NULL
    `);

    // Drop FK on sub_category_name
    await queryRunner.query(`
      ALTER TABLE "product_master"
      DROP CONSTRAINT IF EXISTS "FK_product_master_sub_category_name"
    `);

    // Drop sub_category_name column
    await queryRunner.query(`
      ALTER TABLE "product_master"
      DROP COLUMN "sub_category_name"
    `);
  }
}
