import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPurityCode1785565874091 implements MigrationInterface {
    name = 'AddPurityCode1785565874091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD "purity_code" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP COLUMN "purity_code"`);
    }

}
