import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeLabourRateToString1776500000000
  implements MigrationInterface
{
  name = 'ChangeLabourRateToString1776500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Change labour_rate column from numeric(10,2) to varchar(50)
    await queryRunner.query(
      `ALTER TABLE "product_master" ALTER COLUMN "labour_rate" TYPE character varying(50) USING labour_rate::text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert labour_rate column back to numeric(10,2)
    await queryRunner.query(
      `ALTER TABLE "product_master" ALTER COLUMN "labour_rate" TYPE numeric(10,2) USING labour_rate::numeric`,
    );
  }
}
