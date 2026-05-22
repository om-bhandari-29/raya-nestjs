import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVariantOfIdToItemMasterVariant1779650000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_master_variant" ADD "variant_of_id" integer`);
    await queryRunner.query(`ALTER TABLE "item_master_variant" ADD CONSTRAINT "FK_item_master_variant_variant_of_id" FOREIGN KEY ("variant_of_id") REFERENCES "item_master"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_master_variant" DROP CONSTRAINT "FK_item_master_variant_variant_of_id"`);
    await queryRunner.query(`ALTER TABLE "item_master_variant" DROP COLUMN "variant_of_id"`);
  }
}
