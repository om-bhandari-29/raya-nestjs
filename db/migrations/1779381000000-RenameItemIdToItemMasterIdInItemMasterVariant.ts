import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameItemIdToItemMasterIdInItemMasterVariant1779381000000 implements MigrationInterface {
  name = 'RenameItemIdToItemMasterIdInItemMasterVariant1779381000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_master_variant" RENAME COLUMN "item_id" TO "item_master_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_master_variant" RENAME COLUMN "item_master_id" TO "item_id"`);
  }
}
