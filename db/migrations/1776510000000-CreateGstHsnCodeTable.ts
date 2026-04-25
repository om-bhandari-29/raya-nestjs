import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGstHsnCodeTable1776510000000 implements MigrationInterface {
  name = 'CreateGstHsnCodeTable1776510000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "gst_hsn_code" (
        "id" SERIAL NOT NULL,
        "hsn_code" character varying(20) NOT NULL,
        "description" character varying(255) NOT NULL,
        "gst_rate" numeric(5,2) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "UQ_gst_hsn_code_hsn_code" UNIQUE ("hsn_code"),
        CONSTRAINT "PK_gst_hsn_code" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "gst_hsn_code"`);
  }
}
