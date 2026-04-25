import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUomTable1776510100000 implements MigrationInterface {
  name = 'CreateUomTable1776510100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "uom" (
        "id" SERIAL NOT NULL,
        "name" character varying(50) NOT NULL,
        "description" character varying(255),
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "UQ_uom_name" UNIQUE ("name"),
        CONSTRAINT "PK_uom" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "uom"`);
  }
}
