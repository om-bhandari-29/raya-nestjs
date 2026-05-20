import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameAttributeTypeToType1779274462527 implements MigrationInterface {
    name = 'RenameAttributeTypeToType1779274462527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_attribute_value" RENAME COLUMN "attribute_type" TO "type"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_attribute_value" RENAME COLUMN "type" TO "attribute_type"`);
    }

}
