import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAttributeIdToAttributeName1778900400000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // attribute_id → attribute_name already applied in DB
    // Just need to rename attribute_value → name
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" RENAME COLUMN "attribute_value" TO "name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" RENAME COLUMN "name" TO "attribute_value"`,
    );
  }
}
