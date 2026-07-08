import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMetalPurity1783394287434 implements MigrationInterface {
    name = 'UpdateMetalPurity1783394287434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_blueprints" DROP CONSTRAINT "FK_product_blueprints_design_id"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "FK_design_variant_allowed_metals_variant_id"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "FK_design_variant_allowed_metals_metal_purity_id"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "FK_design_variant_allowed_metals_metal_color_id"`);
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" DROP CONSTRAINT "UQ_blueprint_zone_shape"`);
        await queryRunner.query(`ALTER TABLE "product_blueprints" DROP CONSTRAINT "UQ_product_blueprints_design_variant_gender"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "UQ_design_variant_allowed_metals_variant_purity_color"`);
        
        // 1. Rename existing 'name' column to 'purity'
        await queryRunner.query(`ALTER TABLE "metal_purities" RENAME COLUMN "name" TO "purity"`);
        
        // 2. Add 'name' column back as nullable
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD "name" character varying(100)`);
        
        // 3. Drop 'code' column
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP CONSTRAINT "UQ_metal_purities_code"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP COLUMN "code"`);
        
        // 4. Add 'metal_id' (nullable to handle existing rows) and decimal columns
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD "metal_id" integer`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD "percentage" numeric(10,4)`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD "rate_per_gram_inr" numeric(18,4)`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD "rate_per_gram_usd" numeric(18,4)`);
        
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" ALTER COLUMN "shape_normalized" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" ALTER COLUMN "dim_l_mm" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" ALTER COLUMN "dim_w_mm" DROP DEFAULT`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "metal_master_id_seq" OWNED BY "metal_master"."id"`);
        await queryRunner.query(`ALTER TABLE "metal_master" ALTER COLUMN "id" SET DEFAULT nextval('"metal_master_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "metal_master" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "metal_master" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "metal_master" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" ADD CONSTRAINT "UQ_f148f6194d003e7340585debd1d" UNIQUE ("blueprint_id", "zone_name", "shape_normalized")`);
        await queryRunner.query(`ALTER TABLE "product_blueprints" ADD CONSTRAINT "UQ_849fd64f78b0463ccddda677af8" UNIQUE ("design_id", "variant_name", "target_gender")`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "UQ_d60079bb432e58180c724db8e91" UNIQUE ("variant_id", "metal_purity_id", "metal_color_id")`);
        await queryRunner.query(`ALTER TABLE "product_blueprints" ADD CONSTRAINT "FK_65635357d562a32f130abd6de38" FOREIGN KEY ("design_id") REFERENCES "product_designs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD CONSTRAINT "FK_f0e4871046a79f60a1ca0fb7c2b" FOREIGN KEY ("metal_id") REFERENCES "metal_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "FK_fce707b4b129207b688454060eb" FOREIGN KEY ("variant_id") REFERENCES "product_blueprints"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "FK_ee21b22f49cdb8c52a545d1eb7a" FOREIGN KEY ("metal_purity_id") REFERENCES "metal_purities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "FK_85e8764c77e2cceddbace9ad9b4" FOREIGN KEY ("metal_color_id") REFERENCES "metal_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "FK_85e8764c77e2cceddbace9ad9b4"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "FK_ee21b22f49cdb8c52a545d1eb7a"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "FK_fce707b4b129207b688454060eb"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP CONSTRAINT "FK_f0e4871046a79f60a1ca0fb7c2b"`);
        await queryRunner.query(`ALTER TABLE "product_blueprints" DROP CONSTRAINT "FK_65635357d562a32f130abd6de38"`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" DROP CONSTRAINT "UQ_d60079bb432e58180c724db8e91"`);
        await queryRunner.query(`ALTER TABLE "product_blueprints" DROP CONSTRAINT "UQ_849fd64f78b0463ccddda677af8"`);
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" DROP CONSTRAINT "UQ_f148f6194d003e7340585debd1d"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "metal_master" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "metal_master" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "metal_master" ALTER COLUMN "id" SET DEFAULT nextval('metal_colors_id_seq')`);
        await queryRunner.query(`ALTER TABLE "metal_master" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "metal_master_id_seq"`);
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" ALTER COLUMN "dim_w_mm" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" ALTER COLUMN "dim_l_mm" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" ALTER COLUMN "shape_normalized" SET DEFAULT 'round'`);
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP COLUMN "rate_per_gram_usd"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP COLUMN "rate_per_gram_inr"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP COLUMN "percentage"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP COLUMN "metal_id"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD "code" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "metal_purities" ADD CONSTRAINT "UQ_metal_purities_code" UNIQUE ("code")`);
        
        // Revert columns
        await queryRunner.query(`ALTER TABLE "metal_purities" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "metal_purities" RENAME COLUMN "purity" TO "name"`);

        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "UQ_design_variant_allowed_metals_variant_purity_color" UNIQUE ("variant_id", "metal_purity_id", "metal_color_id")`);
        await queryRunner.query(`ALTER TABLE "product_blueprints" ADD CONSTRAINT "UQ_product_blueprints_design_variant_gender" UNIQUE ("variant_name", "target_gender", "design_id")`);
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" ADD CONSTRAINT "UQ_blueprint_zone_shape" UNIQUE ("blueprint_id", "zone_name", "shape_normalized")`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "FK_design_variant_allowed_metals_metal_color_id" FOREIGN KEY ("metal_color_id") REFERENCES "metal_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "FK_design_variant_allowed_metals_metal_purity_id" FOREIGN KEY ("metal_purity_id") REFERENCES "metal_purities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "design_variant_allowed_metals" ADD CONSTRAINT "FK_design_variant_allowed_metals_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_blueprints"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_blueprints" ADD CONSTRAINT "FK_product_blueprints_design_id" FOREIGN KEY ("design_id") REFERENCES "product_designs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
