import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateItemAttributeMasterAndValueTables1776510400000
  implements MigrationInterface
{
  name = 'CreateItemAttributeMasterAndValueTables1776510400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "item_attribute_master" (
        "id" SERIAL NOT NULL,
        "attribute_name" character varying(255) NOT NULL,
        "status" boolean NOT NULL DEFAULT true,
        "is_base_attribute" boolean NOT NULL DEFAULT false,
        "numeric_values" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_item_attribute_master" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "item_attribute_value" (
        "id" SERIAL NOT NULL,
        "attribute_id" integer NOT NULL,
        "attribute_value" character varying(255) NOT NULL,
        "attribute_type" character varying(100),
        "abbreviation" character varying(50),
        "purity_factor" numeric(5,3) NOT NULL DEFAULT '0',
        CONSTRAINT "PK_item_attribute_value" PRIMARY KEY ("id"),
        CONSTRAINT "FK_item_attribute_value_attribute"
          FOREIGN KEY ("attribute_id") REFERENCES "item_attribute_master"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item_attribute_value"`);
    await queryRunner.query(`DROP TABLE "item_attribute_master"`);
  }
}
