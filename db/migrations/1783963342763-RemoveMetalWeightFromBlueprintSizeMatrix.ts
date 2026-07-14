import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveMetalWeightFromBlueprintSizeMatrix1783963342763 implements MigrationInterface {
    name = 'RemoveMetalWeightFromBlueprintSizeMatrix1783963342763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blueprint_size_matrix" DROP COLUMN "metal_weight"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blueprint_size_matrix" ADD "metal_weight" numeric(6,3) DEFAULT '0'`);
    }

}
