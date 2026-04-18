import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubCategoryTable1776485595000 implements MigrationInterface {
  name = 'CreateSubCategoryTable1776485595000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "sub_category" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "item_group_id" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_59f4461923255f1ce7fc5e7423c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD CONSTRAINT "FK_sub_category_item_group" FOREIGN KEY ("item_group_id") REFERENCES "item_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT "FK_sub_category_item_group"`,
    );
    await queryRunner.query(`DROP TABLE "sub_category"`);
  }
}
