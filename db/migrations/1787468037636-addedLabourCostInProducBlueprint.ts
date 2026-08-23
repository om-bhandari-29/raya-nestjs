import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedLabourCostInProducBlueprint1787468037636 implements MigrationInterface {
    name = 'AddedLabourCostInProducBlueprint1787468037636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_blueprints" ADD "labour_cost_in_inr" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product_blueprints" ADD "labour_cost_in_usd" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_blueprints" DROP COLUMN "labour_cost_in_usd"`);
        await queryRunner.query(`ALTER TABLE "product_blueprints" DROP COLUMN "labour_cost_in_inr"`);
    }

}
