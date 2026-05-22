import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameItemTableToItemMaster1779378438213 implements MigrationInterface {
    name = 'RenameItemTableToItemMaster1779378438213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_barcode" DROP CONSTRAINT "FK_49bdeee32506b401cedd4d5d21b"`);
        await queryRunner.query(`ALTER TABLE "item_variant" DROP CONSTRAINT "FK_b7b98efc0fc3d32b3ab9489336d"`);
        await queryRunner.query(`ALTER TABLE "item_variant" DROP CONSTRAINT "FK_14e2292f787b3b4fdba0cc0ef63"`);
        await queryRunner.query(`ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_73be909561c4e2693942dd2a90b"`);
        await queryRunner.query(`CREATE TYPE "public"."item_master_default_material_request_type_enum" AS ENUM('purchase', 'material_transfer', 'material_issue', 'manufacture', 'customer_provided')`);
        await queryRunner.query(`CREATE TYPE "public"."item_master_valuation_method_enum" AS ENUM('fifo', 'moving_average', 'lifo')`);
        await queryRunner.query(`CREATE TABLE "item_master" ("id" SERIAL NOT NULL, "product_master_id" integer NOT NULL, "name" character varying(255) NOT NULL, "item_group_id" integer NOT NULL, "hsn_sac_id" integer, "default_uom_id" integer, "fixed_qty" numeric(10,2) NOT NULL DEFAULT '0', "is_disabled" boolean NOT NULL DEFAULT false, "allow_alternative_item" boolean NOT NULL DEFAULT false, "maintain_stock" boolean NOT NULL DEFAULT true, "is_in_stock" boolean NOT NULL DEFAULT false, "has_variants" boolean NOT NULL DEFAULT false, "estimated_delivery_days" integer NOT NULL DEFAULT '0', "valuation_rate" numeric(10,2) NOT NULL DEFAULT '0', "is_fixed_asset" boolean NOT NULL DEFAULT false, "over_delivery_receipt_allowance" numeric(5,3) NOT NULL DEFAULT '0', "over_billing_allowance" numeric(5,3) NOT NULL DEFAULT '0', "description" text, "shelf_life_in_days" integer NOT NULL DEFAULT '0', "warranty_period_in_days" integer, "end_of_life" date NOT NULL DEFAULT '2099-12-31', "weight_per_unit" numeric(10,3) NOT NULL DEFAULT '0', "weight_uom_id" integer, "default_material_request_type" "public"."item_master_default_material_request_type_enum" NOT NULL DEFAULT 'purchase', "valuation_method" "public"."item_master_valuation_method_enum", "allow_negative_stock" boolean NOT NULL DEFAULT false, "stones" character varying(255), "gross_weight" numeric(10,3) NOT NULL DEFAULT '0', "net_weight" numeric(10,3) NOT NULL DEFAULT '0', "stones_weight_in_gram" numeric(10,3) NOT NULL DEFAULT '0', "stone_carat_wt" numeric(10,3) NOT NULL DEFAULT '0', "pure_weight_metal" numeric(10,3) NOT NULL DEFAULT '0', "labor_rate" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_081e88235eb8474f36c674d9737" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "item_barcode" ADD CONSTRAINT "FK_49bdeee32506b401cedd4d5d21b" FOREIGN KEY ("item_id") REFERENCES "item_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_variant" ADD CONSTRAINT "FK_b7b98efc0fc3d32b3ab9489336d" FOREIGN KEY ("item_id") REFERENCES "item_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_variant" ADD CONSTRAINT "FK_14e2292f787b3b4fdba0cc0ef63" FOREIGN KEY ("variant_of_id") REFERENCES "item_master"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_73be909561c4e2693942dd2a90b" FOREIGN KEY ("item_id") REFERENCES "item_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_master" ADD CONSTRAINT "FK_15588b0d8dac38d6866b212ff57" FOREIGN KEY ("product_master_id") REFERENCES "product_master"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_master" ADD CONSTRAINT "FK_ee44c887808116e9c54ecabf3ed" FOREIGN KEY ("item_group_id") REFERENCES "item_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_master" ADD CONSTRAINT "FK_6a0cc1e414b1519c67957cfedb3" FOREIGN KEY ("hsn_sac_id") REFERENCES "gst_hsn_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_master" ADD CONSTRAINT "FK_8a4b0e50f07269c5b69d9b3f38e" FOREIGN KEY ("default_uom_id") REFERENCES "uom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_master" ADD CONSTRAINT "FK_b4b427b576e0a870294cc04850f" FOREIGN KEY ("weight_uom_id") REFERENCES "uom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_master" DROP CONSTRAINT "FK_b4b427b576e0a870294cc04850f"`);
        await queryRunner.query(`ALTER TABLE "item_master" DROP CONSTRAINT "FK_8a4b0e50f07269c5b69d9b3f38e"`);
        await queryRunner.query(`ALTER TABLE "item_master" DROP CONSTRAINT "FK_6a0cc1e414b1519c67957cfedb3"`);
        await queryRunner.query(`ALTER TABLE "item_master" DROP CONSTRAINT "FK_ee44c887808116e9c54ecabf3ed"`);
        await queryRunner.query(`ALTER TABLE "item_master" DROP CONSTRAINT "FK_15588b0d8dac38d6866b212ff57"`);
        await queryRunner.query(`ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_73be909561c4e2693942dd2a90b"`);
        await queryRunner.query(`ALTER TABLE "item_variant" DROP CONSTRAINT "FK_14e2292f787b3b4fdba0cc0ef63"`);
        await queryRunner.query(`ALTER TABLE "item_variant" DROP CONSTRAINT "FK_b7b98efc0fc3d32b3ab9489336d"`);
        await queryRunner.query(`ALTER TABLE "item_barcode" DROP CONSTRAINT "FK_49bdeee32506b401cedd4d5d21b"`);
        await queryRunner.query(`DROP TABLE "item_master"`);
        await queryRunner.query(`DROP TYPE "public"."item_master_valuation_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."item_master_default_material_request_type_enum"`);
        await queryRunner.query(`ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_73be909561c4e2693942dd2a90b" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_variant" ADD CONSTRAINT "FK_14e2292f787b3b4fdba0cc0ef63" FOREIGN KEY ("variant_of_id") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_variant" ADD CONSTRAINT "FK_b7b98efc0fc3d32b3ab9489336d" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_barcode" ADD CONSTRAINT "FK_49bdeee32506b401cedd4d5d21b" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
