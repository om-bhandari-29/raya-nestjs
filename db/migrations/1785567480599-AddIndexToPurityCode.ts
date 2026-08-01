import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToPurityCode1785567480599 implements MigrationInterface {
    name = 'AddIndexToPurityCode1785567480599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_a3ea3bdba66c5eb39b28e29513" ON "metal_purities" ("purity_code") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a3ea3bdba66c5eb39b28e29513"`);
    }

}
