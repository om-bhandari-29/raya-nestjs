import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMetalPuritiesAndMetalColorsTables1781300000000
  implements MigrationInterface
{
  name = 'CreateMetalPuritiesAndMetalColorsTables1781300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "metal_purities" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "code" character varying(20) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "UQ_metal_purities_code" UNIQUE ("code"),
        CONSTRAINT "PK_metal_purities" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "metal_colors" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "code" character varying(20) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "UQ_metal_colors_code" UNIQUE ("code"),
        CONSTRAINT "PK_metal_colors" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "metal_colors"`);
    await queryRunner.query(`DROP TABLE "metal_purities"`);
  }
}
