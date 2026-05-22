import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameItemVariantToItemMasterVariant1779546000000 implements MigrationInterface {
  name = 'RenameItemVariantToItemMasterVariant1779546000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_variant" RENAME TO "item_master_variant"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_master_variant" RENAME TO "item_variant"`);
  }
}
