import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenField1772817796088 implements MigrationInterface {
  name = 'AddRefreshTokenField1772817796088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "refresh_token" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refresh_token"`);
  }
}
