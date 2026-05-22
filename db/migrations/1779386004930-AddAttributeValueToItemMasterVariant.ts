import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttributeValueToItemMasterVariant1779386004930 implements MigrationInterface {
    name = 'AddAttributeValueToItemMasterVariant1779386004930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_master_variant" ADD "attribute_value" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_master_variant" DROP COLUMN "attribute_value"`);
    }

}
