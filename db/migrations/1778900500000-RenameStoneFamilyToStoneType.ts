import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameStoneFamilyToStoneType1778900500000
  implements MigrationInterface
{
  name = 'RenameStoneFamilyToStoneType1778900500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename stone_family table to stone_type
    await queryRunner.query(`ALTER TABLE "stone_family" RENAME TO "stone_type"`);
    await queryRunner.query(`ALTER TABLE "stone_type" RENAME CONSTRAINT "PK_stone_family" TO "PK_stone_type"`);

    // Rename stone_family_id column in item_stone_detail
    await queryRunner.query(`ALTER TABLE "item_stone_detail" RENAME COLUMN "stone_family_id" TO "stone_type_id"`);
    await queryRunner.query(`ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_item_stone_detail_family"`);
    await queryRunner.query(`
      ALTER TABLE "item_stone_detail"
        ADD CONSTRAINT "FK_item_stone_detail_type"
        FOREIGN KEY ("stone_type_id") REFERENCES "stone_type"("id") ON DELETE RESTRICT
    `);

    // Rename stone_family column in item_variant
    await queryRunner.query(`ALTER TABLE "item_variant" RENAME COLUMN "stone_family" TO "stone_type"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert item_variant column
    await queryRunner.query(`ALTER TABLE "item_variant" RENAME COLUMN "stone_type" TO "stone_family"`);

    // Revert item_stone_detail FK and column
    await queryRunner.query(`ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_item_stone_detail_type"`);
    await queryRunner.query(`ALTER TABLE "item_stone_detail" RENAME COLUMN "stone_type_id" TO "stone_family_id"`);
    await queryRunner.query(`
      ALTER TABLE "item_stone_detail"
        ADD CONSTRAINT "FK_item_stone_detail_family"
        FOREIGN KEY ("stone_family_id") REFERENCES "stone_family"("id") ON DELETE RESTRICT
    `);

    // Revert table rename
    await queryRunner.query(`ALTER TABLE "stone_type" RENAME CONSTRAINT "PK_stone_type" TO "PK_stone_family"`);
    await queryRunner.query(`ALTER TABLE "stone_type" RENAME TO "stone_family"`);
  }
}
