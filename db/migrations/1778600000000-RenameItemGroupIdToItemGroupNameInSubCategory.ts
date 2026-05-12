import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameItemGroupIdToItemGroupNameInSubCategory1778600000000 implements MigrationInterface {
  name = 'RenameItemGroupIdToItemGroupNameInSubCategory1778600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_category" RENAME COLUMN "item_group_id" TO "item_group_name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_category" RENAME COLUMN "item_group_name" TO "item_group_id"`,
    );
  }
}
