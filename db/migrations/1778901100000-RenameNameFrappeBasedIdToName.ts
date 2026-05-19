import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameNameFrappeBasedIdToName1778901100000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop FK from sub_category that references name_frappe_based_id
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT IF EXISTS "FK_sub_category_item_group_name"`,
    );

    // Drop unique constraint on name_frappe_based_id
    await queryRunner.query(
      `ALTER TABLE "item_group" DROP CONSTRAINT IF EXISTS "UQ_item_group_name_frappe_based_id"`,
    );

    // Rename column
    await queryRunner.query(
      `ALTER TABLE "item_group" RENAME COLUMN "name_frappe_based_id" TO "name"`,
    );

    // Re-add unique constraint
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD CONSTRAINT "UQ_item_group_name" UNIQUE ("name")`,
    );

    // Re-add FK from sub_category referencing new column name
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD CONSTRAINT "FK_sub_category_item_group_name" FOREIGN KEY ("item_group_name") REFERENCES "item_group"("name") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT IF EXISTS "FK_sub_category_item_group_name"`,
    );

    await queryRunner.query(
      `ALTER TABLE "item_group" DROP CONSTRAINT IF EXISTS "UQ_item_group_name"`,
    );

    await queryRunner.query(
      `ALTER TABLE "item_group" RENAME COLUMN "name" TO "name_frappe_based_id"`,
    );

    await queryRunner.query(
      `ALTER TABLE "item_group" ADD CONSTRAINT "UQ_item_group_name_frappe_based_id" UNIQUE ("name_frappe_based_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD CONSTRAINT "FK_sub_category_item_group_name" FOREIGN KEY ("item_group_name") REFERENCES "item_group"("name_frappe_based_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
