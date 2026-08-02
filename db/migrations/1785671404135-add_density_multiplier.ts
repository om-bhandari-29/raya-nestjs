import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDensityMultiplier1785671404135 implements MigrationInterface {
    name = 'AddDensityMultiplier1785671404135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD "density_multiplier" numeric(10,4)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP COLUMN "density_multiplier"`);
    }

}
