import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedbaseQtyToAccepetDecimalAndNullable1780467950135 implements MigrationInterface {
    name = 'UpdatedbaseQtyToAccepetDecimalAndNullable1780467950135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "engineering_templates" DROP COLUMN "base_qty"`);
        await queryRunner.query(`ALTER TABLE "engineering_templates" ADD "base_qty" numeric(10,5)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "engineering_templates" DROP COLUMN "base_qty"`);
        await queryRunner.query(`ALTER TABLE "engineering_templates" ADD "base_qty" integer NOT NULL`);
    }

}
