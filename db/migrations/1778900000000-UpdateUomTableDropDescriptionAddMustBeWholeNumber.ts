import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUomTableDropDescriptionAddMustBeWholeNumber1778900000000 implements MigrationInterface {
  name = 'UpdateUomTableDropDescriptionAddMustBeWholeNumber1778900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uom" DROP COLUMN IF EXISTS "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uom" ADD COLUMN "must_be_whole_number" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uom" DROP COLUMN IF EXISTS "must_be_whole_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uom" ADD COLUMN "description" character varying(255)`,
    );
  }
}
