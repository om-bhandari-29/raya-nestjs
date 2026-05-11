import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterGstHsnCodeDescriptionToText1778470000000 implements MigrationInterface {
  name = 'AlterGstHsnCodeDescriptionToText1778470000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ALTER COLUMN "description" TYPE text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ALTER COLUMN "description" TYPE character varying(255)`,
    );
  }
}
