import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameMetalColorIdToMetalMasterId1783577385517 implements MigrationInterface {
    name = 'RenameMetalColorIdToMetalMasterId1783577385517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "FK_85e8764c77e2cceddbace9ad9b4"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "UQ_d60079bb432e58180c724db8e91"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" RENAME COLUMN "metal_color_id" TO "metal_master_id"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP CONSTRAINT "FK_f0e4871046a79f60a1ca0fb7c2b"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ALTER COLUMN "metal_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ALTER COLUMN "metal_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "UQ_176f83bcc4d6b90ca99442fa758" UNIQUE ("variant_id", "metal_purity_id", "metal_master_id")`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD CONSTRAINT "FK_f0e4871046a79f60a1ca0fb7c2b" FOREIGN KEY ("metal_id") REFERENCES "metal_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "FK_d2abcdfeab29d2cea99a5898b5a" FOREIGN KEY ("metal_master_id") REFERENCES "metal_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "FK_d2abcdfeab29d2cea99a5898b5a"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP CONSTRAINT "FK_f0e4871046a79f60a1ca0fb7c2b"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "UQ_176f83bcc4d6b90ca99442fa758"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ALTER COLUMN "metal_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ALTER COLUMN "metal_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD CONSTRAINT "FK_f0e4871046a79f60a1ca0fb7c2b" FOREIGN KEY ("metal_id") REFERENCES "metal_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" RENAME COLUMN "metal_master_id" TO "metal_color_id"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "UQ_d60079bb432e58180c724db8e91" UNIQUE ("variant_id", "metal_purity_id", "metal_color_id")`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "FK_85e8764c77e2cceddbace9ad9b4" FOREIGN KEY ("metal_color_id") REFERENCES "metal_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
