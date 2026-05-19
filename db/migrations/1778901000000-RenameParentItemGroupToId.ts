import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameParentItemGroupToId1778901000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing FK
    await queryRunner.query(
      `ALTER TABLE "item_group" DROP CONSTRAINT "FK_item_group_parent_item_group"`,
    );

    // Drop old column
    await queryRunner.query(
      `ALTER TABLE "item_group" DROP COLUMN "parent_item_group"`,
    );

    // Add new integer column
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD COLUMN "parent_item_group_id" integer NULL`,
    );

    // Add FK referencing primary key
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD CONSTRAINT "FK_item_group_parent_item_group_id" FOREIGN KEY ("parent_item_group_id") REFERENCES "item_group"("id") ON DELETE SET NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_group" DROP CONSTRAINT "FK_item_group_parent_item_group_id"`,
    );

    await queryRunner.query(
      `ALTER TABLE "item_group" DROP COLUMN "parent_item_group_id"`,
    );

    await queryRunner.query(
      `ALTER TABLE "item_group" ADD COLUMN "parent_item_group" varchar(255) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "item_group" ADD CONSTRAINT "FK_item_group_parent_item_group" FOREIGN KEY ("parent_item_group") REFERENCES "item_group"("name_frappe_based_id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }
}
