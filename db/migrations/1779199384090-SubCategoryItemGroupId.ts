import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubCategoryItemGroupId1779199384090 implements MigrationInterface {
  name = 'SubCategoryItemGroupId1779199384090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_group" DROP CONSTRAINT "FK_item_group_parent_item_group_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT "FK_sub_category_item_group_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_master" DROP CONSTRAINT "FK_product_master_sub_category_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_barcode" DROP CONSTRAINT "FK_item_barcode_item"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_barcode" DROP CONSTRAINT "FK_item_barcode_uom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" DROP CONSTRAINT "FK_item_variant_item"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" DROP CONSTRAINT "FK_item_variant_variant_of"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" DROP CONSTRAINT "FK_item_variant_value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_item_stone_detail_item"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_item_stone_detail_clarity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_item_stone_detail_shape"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_item_stone_detail_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_item_product_master"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_item_item_group"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_item_default_uom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_item_weight_uom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_item_hsn_sac"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_STONE_GENERATED_KEY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STONE_NAME"`);
    await queryRunner.query(
      `ALTER TABLE "sub_category" RENAME COLUMN "item_group_name" TO "item_group_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uom" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "uom" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "stone_type_id_seq" OWNED BY "stone_type"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_type" ALTER COLUMN "id" SET DEFAULT nextval('"stone_type_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_type" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_type" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_type" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP COLUMN "item_group_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD "item_group_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_shape" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_shape" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_clarity" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_clarity" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_dimension" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_dimension" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" ALTER COLUMN "attribute_name" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ALTER COLUMN "attribute_name" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."material_request_type_enum" RENAME TO "material_request_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."item_default_material_request_type_enum" AS ENUM('purchase', 'material_transfer', 'material_issue', 'manufacture', 'customer_provided')`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "default_material_request_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "default_material_request_type" TYPE "public"."item_default_material_request_type_enum" USING "default_material_request_type"::"text"::"public"."item_default_material_request_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "default_material_request_type" SET DEFAULT 'purchase'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."material_request_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."valuation_method_enum" RENAME TO "valuation_method_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."item_valuation_method_enum" AS ENUM('fifo', 'moving_average', 'lifo')`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "valuation_method" TYPE "public"."item_valuation_method_enum" USING "valuation_method"::"text"::"public"."item_valuation_method_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."valuation_method_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_9d6d873483c7fae39567c209192" UNIQUE ("mobile_number")`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD CONSTRAINT "FK_6180c36a5cc7763920c0c3fae9d" FOREIGN KEY ("parent_item_group_id") REFERENCES "item_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD CONSTRAINT "FK_d5ee86701163a08d6a58885858a" FOREIGN KEY ("item_group_id") REFERENCES "item_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_master" ADD CONSTRAINT "FK_ffacc8e15577ac352331903eabb" FOREIGN KEY ("sub_category_name") REFERENCES "sub_category"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" ADD CONSTRAINT "FK_eb99f6e0f797eb778da27818139" FOREIGN KEY ("attribute_name") REFERENCES "item_attribute_master"("name") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_barcode" ADD CONSTRAINT "FK_49bdeee32506b401cedd4d5d21b" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_barcode" ADD CONSTRAINT "FK_cf0e47b257488b79d75bb557b68" FOREIGN KEY ("uom_id") REFERENCES "uom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ADD CONSTRAINT "FK_b7b98efc0fc3d32b3ab9489336d" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ADD CONSTRAINT "FK_14e2292f787b3b4fdba0cc0ef63" FOREIGN KEY ("variant_of_id") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ADD CONSTRAINT "FK_13b6f223fe77ba030669dd80b8a" FOREIGN KEY ("attribute_name") REFERENCES "item_attribute_master"("name") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ADD CONSTRAINT "FK_aa90c2e36dc89dc1f6db46d2dc4" FOREIGN KEY ("value_id") REFERENCES "item_attribute_value"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_73be909561c4e2693942dd2a90b" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_758a22621752d4754a124d7cc5c" FOREIGN KEY ("stone_type_id") REFERENCES "stone_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_c92bb765e53b87bf774d9905156" FOREIGN KEY ("stone_clarity_id") REFERENCES "stone_clarity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_e3effa83a04bd54cfd8f3d89487" FOREIGN KEY ("stone_shape_id") REFERENCES "stone_shape"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_b67e68190ab0830f20f172951b9" FOREIGN KEY ("product_master_id") REFERENCES "product_master"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_0aaff10eef9f837947e6a9691d8" FOREIGN KEY ("item_group_id") REFERENCES "item_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_3323c3d5e5ccf07d03fe88bab73" FOREIGN KEY ("hsn_sac_id") REFERENCES "gst_hsn_code"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_c5a30f8aec26906e1c08d26a677" FOREIGN KEY ("default_uom_id") REFERENCES "uom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_d59cd69dfc4194b6f4c464740b9" FOREIGN KEY ("weight_uom_id") REFERENCES "uom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_d59cd69dfc4194b6f4c464740b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_c5a30f8aec26906e1c08d26a677"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_3323c3d5e5ccf07d03fe88bab73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_0aaff10eef9f837947e6a9691d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_b67e68190ab0830f20f172951b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_e3effa83a04bd54cfd8f3d89487"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_c92bb765e53b87bf774d9905156"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_758a22621752d4754a124d7cc5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_73be909561c4e2693942dd2a90b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" DROP CONSTRAINT "FK_aa90c2e36dc89dc1f6db46d2dc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" DROP CONSTRAINT "FK_13b6f223fe77ba030669dd80b8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" DROP CONSTRAINT "FK_14e2292f787b3b4fdba0cc0ef63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" DROP CONSTRAINT "FK_b7b98efc0fc3d32b3ab9489336d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_barcode" DROP CONSTRAINT "FK_cf0e47b257488b79d75bb557b68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_barcode" DROP CONSTRAINT "FK_49bdeee32506b401cedd4d5d21b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" DROP CONSTRAINT "FK_eb99f6e0f797eb778da27818139"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_master" DROP CONSTRAINT "FK_ffacc8e15577ac352331903eabb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT "FK_d5ee86701163a08d6a58885858a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_group" DROP CONSTRAINT "FK_6180c36a5cc7763920c0c3fae9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_9d6d873483c7fae39567c209192"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."valuation_method_enum_old" AS ENUM('fifo', 'moving_average', 'lifo')`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "valuation_method" TYPE "public"."valuation_method_enum_old" USING "valuation_method"::"text"::"public"."valuation_method_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."item_valuation_method_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."valuation_method_enum_old" RENAME TO "valuation_method_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."material_request_type_enum_old" AS ENUM('purchase', 'material_transfer', 'material_issue', 'manufacture', 'customer_provided')`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "default_material_request_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "default_material_request_type" TYPE "public"."material_request_type_enum_old" USING "default_material_request_type"::"text"::"public"."material_request_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "default_material_request_type" SET DEFAULT 'purchase'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."item_default_material_request_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."material_request_type_enum_old" RENAME TO "material_request_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ALTER COLUMN "attribute_name" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_value" ALTER COLUMN "attribute_name" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attribute_master" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_dimension" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_dimension" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_clarity" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_clarity" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_shape" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_shape" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP COLUMN "item_group_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD "item_group_id" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_type" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_type" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_type" ALTER COLUMN "id" SET DEFAULT nextval('stone_family_id_seq')`,
    );
    await queryRunner.query(
      `ALTER TABLE "stone_type" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "stone_type_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "uom" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "uom" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_category" RENAME COLUMN "item_group_id" TO "item_group_name"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STONE_NAME" ON "stone_dimension" ("stoneName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STONE_GENERATED_KEY" ON "stone_dimension" ("generatedKey") `,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_item_hsn_sac" FOREIGN KEY ("hsn_sac_id") REFERENCES "gst_hsn_code"("name") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_item_weight_uom" FOREIGN KEY ("weight_uom_id") REFERENCES "uom"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_item_default_uom" FOREIGN KEY ("default_uom_id") REFERENCES "uom"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_item_item_group" FOREIGN KEY ("item_group_id") REFERENCES "item_group"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_item_product_master" FOREIGN KEY ("product_master_id") REFERENCES "product_master"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_item_stone_detail_type" FOREIGN KEY ("stone_type_id") REFERENCES "stone_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_item_stone_detail_shape" FOREIGN KEY ("stone_shape_id") REFERENCES "stone_shape"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_item_stone_detail_clarity" FOREIGN KEY ("stone_clarity_id") REFERENCES "stone_clarity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_item_stone_detail_item" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ADD CONSTRAINT "FK_item_variant_value" FOREIGN KEY ("value_id") REFERENCES "item_attribute_value"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ADD CONSTRAINT "FK_item_variant_variant_of" FOREIGN KEY ("variant_of_id") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_variant" ADD CONSTRAINT "FK_item_variant_item" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_barcode" ADD CONSTRAINT "FK_item_barcode_uom" FOREIGN KEY ("uom_id") REFERENCES "uom"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_barcode" ADD CONSTRAINT "FK_item_barcode_item" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_master" ADD CONSTRAINT "FK_product_master_sub_category_name" FOREIGN KEY ("sub_category_name") REFERENCES "sub_category"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD CONSTRAINT "FK_sub_category_item_group_name" FOREIGN KEY ("item_group_name") REFERENCES "item_group"("name") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD CONSTRAINT "FK_item_group_parent_item_group_id" FOREIGN KEY ("parent_item_group_id") REFERENCES "item_group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
