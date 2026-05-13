import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameAttributeNameToNameAndAddUnique1778900300000 implements MigrationInterface {
  name = 'RenameAttributeNameToNameAndAddUnique1778900300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" RENAME COLUMN "attribute_name" TO "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" ALTER COLUMN "name" SET NOT NULL`,
    );
    // Remove duplicates keeping the row with the lowest id
    await queryRunner.query(`
      DELETE FROM "item_attribute_master"
      WHERE "id" NOT IN (
        SELECT MIN("id") FROM "item_attribute_master" GROUP BY "name"
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" ADD CONSTRAINT "UQ_item_attribute_master_name" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" DROP CONSTRAINT IF EXISTS "UQ_item_attribute_master_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" RENAME COLUMN "name" TO "attribute_name"`,
    );
  }
}
