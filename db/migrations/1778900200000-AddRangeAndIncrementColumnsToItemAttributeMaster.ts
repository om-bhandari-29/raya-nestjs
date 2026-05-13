import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRangeAndIncrementColumnsToItemAttributeMaster1778900200000 implements MigrationInterface {
  name = 'AddRangeAndIncrementColumnsToItemAttributeMaster1778900200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" ADD COLUMN "from_range" numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" ADD COLUMN "to_range" numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" ADD COLUMN "increment" numeric(10,4)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" DROP COLUMN IF EXISTS "increment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" DROP COLUMN IF EXISTS "to_range"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" DROP COLUMN IF EXISTS "from_range"`,
    );
  }
}
