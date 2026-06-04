import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedProductBlueprintMetalOpitionSizeMatrixZonrSlot1780546367680 implements MigrationInterface {
    name = 'CreatedProductBlueprintMetalOpitionSizeMatrixZonrSlot1780546367680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blueprint_size_matrix" ("id" SERIAL NOT NULL, "zone_slot_id" integer NOT NULL, "ring_size" numeric(3,1) NOT NULL, "stone_quantity" integer NOT NULL, CONSTRAINT "UQ_0dd16bdfe4dc07d2468ff728746" UNIQUE ("zone_slot_id", "ring_size"), CONSTRAINT "PK_c16a961b0f7a64e1105ff42af70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blueprint_zone_slots" ("id" SERIAL NOT NULL, "blueprint_id" integer NOT NULL, "zone_name" character varying(50) NOT NULL, "template_id" character varying(150) NOT NULL, "is_dynamic_by_size" boolean NOT NULL, "fixed_quantity" integer, CONSTRAINT "PK_c6d550097650044f1998055b602" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_blueprints" ("id" SERIAL NOT NULL, "design_slug" character varying(100) NOT NULL, "variant_name" character varying(100) NOT NULL, "target_gender" character varying(20) NOT NULL, CONSTRAINT "UQ_513613ce668f4af73c942085130" UNIQUE ("design_slug", "variant_name", "target_gender"), CONSTRAINT "PK_9f1242bdb8af66ab3fb9044c68b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_metal_options" ("id" SERIAL NOT NULL, "blueprint_id" integer NOT NULL, "metal_purity" character varying(50) NOT NULL, "metal_color" character varying(50) NOT NULL, CONSTRAINT "UQ_fcde7e0681a8d69133ff68f3f89" UNIQUE ("blueprint_id", "metal_purity", "metal_color"), CONSTRAINT "PK_579db9982bebda3bec6f78d02fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blueprint_size_matrix" ADD CONSTRAINT "FK_5bbfe7eaa15c668b9ab26594eeb" FOREIGN KEY ("zone_slot_id") REFERENCES "blueprint_zone_slots"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" ADD CONSTRAINT "FK_4ef4401ad9c3cf6bfb7fa073171" FOREIGN KEY ("blueprint_id") REFERENCES "product_blueprints"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_metal_options" ADD CONSTRAINT "FK_ca2a154c66237cf0cb4150c5ebb" FOREIGN KEY ("blueprint_id") REFERENCES "product_blueprints"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_metal_options" DROP CONSTRAINT "FK_ca2a154c66237cf0cb4150c5ebb"`);
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" DROP CONSTRAINT "FK_4ef4401ad9c3cf6bfb7fa073171"`);
        await queryRunner.query(`ALTER TABLE "blueprint_size_matrix" DROP CONSTRAINT "FK_5bbfe7eaa15c668b9ab26594eeb"`);
        await queryRunner.query(`DROP TABLE "product_metal_options"`);
        await queryRunner.query(`DROP TABLE "product_blueprints"`);
        await queryRunner.query(`DROP TABLE "blueprint_zone_slots"`);
        await queryRunner.query(`DROP TABLE "blueprint_size_matrix"`);
    }

}
