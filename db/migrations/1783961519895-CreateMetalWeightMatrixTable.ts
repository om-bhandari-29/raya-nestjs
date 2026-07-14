import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMetalWeightMatrixTable1783961519895 implements MigrationInterface {
    name = 'CreateMetalWeightMatrixTable1783961519895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "metal_weight_matrix" ("id" SERIAL NOT NULL, "variant_id" integer NOT NULL, "ring_size" numeric(3,1) NOT NULL, "base_metal_weight_gm" numeric(6,3) DEFAULT '0', CONSTRAINT "UQ_9d4c3ca798a6847175d9ff92e97" UNIQUE ("variant_id", "ring_size"), CONSTRAINT "PK_948e44ba2f03718f0a03e3986fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "metal_weight_matrix" ADD CONSTRAINT "FK_9dc49c548a8b683e17637502f0e" FOREIGN KEY ("variant_id") REFERENCES "product_blueprints"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metal_weight_matrix" DROP CONSTRAINT "FK_9dc49c548a8b683e17637502f0e"`);
        await queryRunner.query(`DROP TABLE "metal_weight_matrix"`);
    }

}
