import { MigrationInterface, QueryRunner } from "typeorm";

export class EnumMetalType1785561978622 implements MigrationInterface {
    name = 'EnumMetalType1785561978622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP CONSTRAINT "FK_f0e4871046a79f60a1ca0fb7c2b"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "FK_d2abcdfeab29d2cea99a5898b5a"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "UQ_176f83bcc4d6b90ca99442fa758"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" RENAME COLUMN "metal_id" TO "metal_type"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP COLUMN "metal_master_id"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "UQ_43409119802539f294fccaf7285" UNIQUE ("variant_id", "metal_purity_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "UQ_43409119802539f294fccaf7285"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD "metal_master_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "metal_purities" RENAME COLUMN "metal_type" TO "metal_id"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "UQ_176f83bcc4d6b90ca99442fa758" UNIQUE ("variant_id", "metal_purity_id", "metal_master_id")`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "FK_d2abcdfeab29d2cea99a5898b5a" FOREIGN KEY ("metal_master_id") REFERENCES "metal_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD CONSTRAINT "FK_f0e4871046a79f60a1ca0fb7c2b" FOREIGN KEY ("metal_id") REFERENCES "metal_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
