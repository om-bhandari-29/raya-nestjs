import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateItemStoneDetailTable1776510700000
  implements MigrationInterface
{
  name = 'CreateItemStoneDetailTable1776510700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "item_stone_detail" (
        "id" SERIAL NOT NULL,
        "item_id" integer NOT NULL,
        "stone_family_id" integer NOT NULL,
        "stone_clarity_id" integer,
        "stone_shape_id" integer NOT NULL,
        "weight_carat" numeric(10,3) NOT NULL,
        CONSTRAINT "PK_item_stone_detail" PRIMARY KEY ("id"),
        CONSTRAINT "FK_item_stone_detail_item"
          FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_item_stone_detail_family"
          FOREIGN KEY ("stone_family_id") REFERENCES "stone_family"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_item_stone_detail_clarity"
          FOREIGN KEY ("stone_clarity_id") REFERENCES "stone_clarity"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_item_stone_detail_shape"
          FOREIGN KEY ("stone_shape_id") REFERENCES "stone_shape"("id") ON DELETE RESTRICT
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item_stone_detail"`);
  }
}
