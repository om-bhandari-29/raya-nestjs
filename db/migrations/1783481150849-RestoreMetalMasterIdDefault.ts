import { MigrationInterface, QueryRunner } from "typeorm";

export class RestoreMetalMasterIdDefault1783481150849 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "metal_master_id_seq"`);
        await queryRunner.query(`ALTER TABLE "metal_master" ALTER COLUMN "id" SET DEFAULT nextval('metal_master_id_seq')`);
        await queryRunner.query(`ALTER SEQUENCE "metal_master_id_seq" OWNED BY "metal_master"."id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metal_master" ALTER COLUMN "id" DROP DEFAULT`);
    }

}
