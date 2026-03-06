import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderFieldsToUser1772816449820 implements MigrationInterface {
  name = 'AddProviderFieldsToUser1772816449820';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "google_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "facebook_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "provider" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "provider"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "facebook_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "google_id"`);
  }
}
