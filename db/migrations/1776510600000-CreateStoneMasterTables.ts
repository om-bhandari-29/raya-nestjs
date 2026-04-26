import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStoneMasterTables1776510600000 implements MigrationInterface {
  name = 'CreateStoneMasterTables1776510600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "stone_family" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "is_published" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_stone_family" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "stone_clarity" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "is_published" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_stone_clarity" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "stone_shape" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "is_published" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_stone_shape" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "stone_shape"`);
    await queryRunner.query(`DROP TABLE "stone_clarity"`);
    await queryRunner.query(`DROP TABLE "stone_family"`);
  }
}
