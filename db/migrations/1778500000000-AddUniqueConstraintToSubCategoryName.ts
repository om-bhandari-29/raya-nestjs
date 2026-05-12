import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintToSubCategoryName1778500000000 implements MigrationInterface {
  name = 'AddUniqueConstraintToSubCategoryName1778500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD CONSTRAINT "UQ_sub_category_name" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT "UQ_sub_category_name"`,
    );
  }
}
