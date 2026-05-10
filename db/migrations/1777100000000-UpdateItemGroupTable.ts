import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateItemGroupTable1777100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename 'name' to 'name_frappe_based_id' and add UNIQUE constraint
    await queryRunner.query(
      `ALTER TABLE "item_group" RENAME COLUMN "name" TO "name_frappe_based_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_group" ALTER COLUMN "name_frappe_based_id" TYPE varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD CONSTRAINT "UQ_item_group_name_frappe_based_id" UNIQUE ("name_frappe_based_id")`,
    );

    // Add is_group column
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD COLUMN "is_group" boolean NOT NULL DEFAULT false`,
    );

    // Add image column
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD COLUMN "image" varchar(500) NULL`,
    );

    // Add gst_hsn_code column
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD COLUMN "gst_hsn_code" varchar(50) NULL`,
    );

    // Add parent_item_group column (self-referential FK via name_frappe_based_id)
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD COLUMN "parent_item_group" varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD CONSTRAINT "FK_item_group_parent_item_group" FOREIGN KEY ("parent_item_group") REFERENCES "item_group"("name_frappe_based_id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop parent_item_group FK and column
    await queryRunner.query(
      `ALTER TABLE "item_group" DROP CONSTRAINT "FK_item_group_parent_item_group"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_group" DROP COLUMN "parent_item_group"`,
    );

    // Drop gst_hsn_code column
    await queryRunner.query(
      `ALTER TABLE "item_group" DROP COLUMN "gst_hsn_code"`,
    );

    // Drop image column
    await queryRunner.query(`ALTER TABLE "item_group" DROP COLUMN "image"`);

    // Drop is_group column
    await queryRunner.query(`ALTER TABLE "item_group" DROP COLUMN "is_group"`);

    // Drop unique constraint, resize column, and rename back
    await queryRunner.query(
      `ALTER TABLE "item_group" DROP CONSTRAINT "UQ_item_group_name_frappe_based_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_group" ALTER COLUMN "name_frappe_based_id" TYPE varchar(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_group" RENAME COLUMN "name_frappe_based_id" TO "name"`,
    );
  }
}
