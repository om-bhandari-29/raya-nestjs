import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintToProductMasterName1778800100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "product_master"
      ADD CONSTRAINT "UQ_product_master_name" UNIQUE ("name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "product_master"
      DROP CONSTRAINT "UQ_product_master_name"
    `);
  }
}
