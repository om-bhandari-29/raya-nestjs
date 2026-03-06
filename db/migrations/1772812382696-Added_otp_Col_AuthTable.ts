import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedOtpColAuthTable1772812382696 implements MigrationInterface {
    name = 'AddedOtpColAuthTable1772812382696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "otp" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otp"`);
    }

}
