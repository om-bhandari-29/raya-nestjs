import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOtpExpirationField1772817272242 implements MigrationInterface {
  name = 'AddOtpExpirationField1772817272242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "otp_expires_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otp_expires_at"`);
  }
}
