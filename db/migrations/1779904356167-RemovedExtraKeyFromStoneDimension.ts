import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedExtraKeyFromStoneDimension1779904356167 implements MigrationInterface {
    name = 'RemovedExtraKeyFromStoneDimension1779904356167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "cutGrade"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "countryOrigin"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "countryOrigin" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "cutGrade" character varying(100)`);
    }

}
