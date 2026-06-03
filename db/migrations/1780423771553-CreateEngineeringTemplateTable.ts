import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEngineeringTemplateTable1780423771553 implements MigrationInterface {
    name = 'CreateEngineeringTemplateTable1780423771553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP CONSTRAINT "FK_item_master_variant_variant_of_id"`);
        await queryRunner.query(`CREATE TABLE "engineering_templates" ("template_id" character varying(150) NOT NULL, "zone_name" character varying(50) NOT NULL, "stone_shape" character varying(50) NOT NULL, "dim_l" numeric(20,10) NOT NULL, "dim_w" numeric(20,10) NOT NULL, "dim_h" numeric(20,10) NOT NULL, "dim_string" character varying(50) NOT NULL, "base_qty" integer NOT NULL, "weight_each_ct" numeric(20,10) NOT NULL, "placement" character varying(50) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_88adb2843a11391c6e39e9ce287" PRIMARY KEY ("template_id"))`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "length" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "width" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "height" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Estimated_Weight_Final_ct" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Price_per_ct_INR" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Price_per_ct_USD" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "length" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "width" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "height" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Estimated_Weight_Final_ct" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Price_per_ct_INR" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Price_per_ct_USD" TYPE numeric(18,8)`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD CONSTRAINT "FK_5d467c9480daba8ceab76b5e6d5" FOREIGN KEY ("variant_of_id") REFERENCES "item_master"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP CONSTRAINT "FK_5d467c9480daba8ceab76b5e6d5"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Price_per_ct_USD" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Price_per_ct_INR" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Estimated_Weight_Final_ct" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "height" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "width" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "length" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Price_per_ct_USD" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Price_per_ct_INR" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "Estimated_Weight_Final_ct" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "height" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "width" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ALTER COLUMN "length" TYPE numeric(10,2)`);
        await queryRunner.query(`DROP TABLE "engineering_templates"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD CONSTRAINT "FK_item_master_variant_variant_of_id" FOREIGN KEY ("variant_of_id") REFERENCES "item_master"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
