import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductMasterTable1776497226000 implements MigrationInterface {
  name = 'CreateProductMasterTable1776497226000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_master_labour_rate_on_enum') THEN CREATE TYPE "public"."product_master_labour_rate_on_enum" AS ENUM('Net', 'Gross', 'Other'); END IF; END $$`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "product_master" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "sub_category_id" integer NOT NULL, "labour_rate" numeric(10,2) NOT NULL, "labour_rate_on" "public"."product_master_labour_rate_on_enum" NOT NULL, "product_description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_product_master" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_master" ADD CONSTRAINT "FK_product_master_sub_category" FOREIGN KEY ("sub_category_id") REFERENCES "sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_master" DROP CONSTRAINT "FK_product_master_sub_category"`,
    );
    await queryRunner.query(`DROP TABLE "product_master"`);
    await queryRunner.query(
      `DROP TYPE "public"."product_master_labour_rate_on_enum"`,
    );
  }
}
