import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMetalWeightToBlueprintSizeMatrix1781105626576 implements MigrationInterface {
    name = 'AddMetalWeightToBlueprintSizeMatrix1781105626576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blueprint_size_matrix" ADD "metal_weight" numeric(6,3) DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blueprint_size_matrix" DROP COLUMN "metal_weight"`);
    }

}
