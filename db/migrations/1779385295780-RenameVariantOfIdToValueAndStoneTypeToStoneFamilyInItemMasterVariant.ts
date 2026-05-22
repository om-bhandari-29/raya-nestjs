import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameVariantOfIdToValueAndStoneTypeToStoneFamilyInItemMasterVariant1779385295780 implements MigrationInterface {
    name = 'RenameVariantOfIdToValueAndStoneTypeToStoneFamilyInItemMasterVariant1779385295780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP CONSTRAINT "FK_aa90c2e36dc89dc1f6db46d2dc4"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP CONSTRAINT "FK_aa776cd641d9f69c4bc14d21350"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP CONSTRAINT "FK_b7b98efc0fc3d32b3ab9489336d"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP CONSTRAINT "FK_14e2292f787b3b4fdba0cc0ef63"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP COLUMN "variant_of_id"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP COLUMN "stone_type"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD "value" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD "stone_family" character varying(255)`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "item_master_variant_id_seq" OWNED BY "item_master_variant"."id"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ALTER COLUMN "id" SET DEFAULT nextval('"item_master_variant_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD CONSTRAINT "FK_ce85d0a9984e15e7d93c44d025a" FOREIGN KEY ("item_master_id") REFERENCES "item_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD CONSTRAINT "FK_1732446cda827bef6f1912c6d62" FOREIGN KEY ("attribute_master_id") REFERENCES "item_attribute_master"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD CONSTRAINT "FK_6681f9ff1581eb139e9c21d458a" FOREIGN KEY ("value_id") REFERENCES "item_attribute_value"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP CONSTRAINT "FK_6681f9ff1581eb139e9c21d458a"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP CONSTRAINT "FK_1732446cda827bef6f1912c6d62"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP CONSTRAINT "FK_ce85d0a9984e15e7d93c44d025a"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ALTER COLUMN "id" SET DEFAULT nextval('item_variant_id_seq')`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "item_master_variant_id_seq"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP COLUMN "stone_family"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD "stone_type" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD "variant_of_id" integer`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD CONSTRAINT "FK_14e2292f787b3b4fdba0cc0ef63" FOREIGN KEY ("variant_of_id") REFERENCES "item_master"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD CONSTRAINT "FK_b7b98efc0fc3d32b3ab9489336d" FOREIGN KEY ("item_master_id") REFERENCES "item_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD CONSTRAINT "FK_aa776cd641d9f69c4bc14d21350" FOREIGN KEY ("attribute_master_id") REFERENCES "item_attribute_master"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD CONSTRAINT "FK_aa90c2e36dc89dc1f6db46d2dc4" FOREIGN KEY ("value_id") REFERENCES "item_attribute_value"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
