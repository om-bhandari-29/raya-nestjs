import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnabledColumnToUom1778900100000 implements MigrationInterface {
  name = 'AddEnabledColumnToUom1778900100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uom" ADD COLUMN "enabled" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uom" DROP COLUMN IF EXISTS "enabled"`,
    );
  }
}
