import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveValueIdFromItemMasterVariant1779385717741 implements MigrationInterface {
    name = 'RemoveValueIdFromItemMasterVariant1779385717741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP CONSTRAINT "FK_6681f9ff1581eb139e9c21d458a"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP COLUMN "value_id"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "item_master_variant_id_seq" OWNED BY "item_master_variant"."id"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ALTER COLUMN "id" SET DEFAULT nextval('"item_master_variant_id_seq"')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_master_variant" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "item_master_variant_id_seq"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD "value_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD CONSTRAINT "FK_6681f9ff1581eb139e9c21d458a" FOREIGN KEY ("value_id") REFERENCES "item_attribute_value"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
