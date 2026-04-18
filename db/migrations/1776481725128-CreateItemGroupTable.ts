import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateItemGroupTable1776481725128 implements MigrationInterface {
  name = 'CreateItemGroupTable1776481725128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "item_group" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b0100c5cb7c67d99ae46197727" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item_group"`);
  }
}
