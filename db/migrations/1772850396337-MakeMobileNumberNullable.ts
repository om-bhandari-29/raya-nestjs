import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeMobileNumberNullable1772850396337 implements MigrationInterface {
  name = 'MakeMobileNumberNullable1772850396337';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "mobile_number" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "mobile_number" SET NOT NULL`,
    );
  }
}
