import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceAttributeNameWithAttributeId1779273839319 implements MigrationInterface {
    name = 'ReplaceAttributeNameWithAttributeId1779273839319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_attribute_value" DROP CONSTRAINT "FK_eb99f6e0f797eb778da27818139"`);
        await queryRunner.query(`ALTER TABLE "item_variant" DROP CONSTRAINT "FK_13b6f223fe77ba030669dd80b8a"`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" RENAME COLUMN "attribute_name" TO "attribute_id"`);
        await queryRunner.query(`ALTER TABLE "item_variant" RENAME COLUMN "attribute_name" TO "attribute_id"`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" DROP COLUMN "attribute_id"`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" ADD "attribute_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item_variant" DROP COLUMN "attribute_id"`);
        await queryRunner.query(`ALTER TABLE "item_variant" ADD "attribute_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" ADD CONSTRAINT "FK_54d3488c0c1b2d7db92d1e924fa" FOREIGN KEY ("attribute_id") REFERENCES "item_attribute_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_variant" ADD CONSTRAINT "FK_82db831bafaeade42081c2611fb" FOREIGN KEY ("attribute_id") REFERENCES "item_attribute_master"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_variant" DROP CONSTRAINT "FK_82db831bafaeade42081c2611fb"`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" DROP CONSTRAINT "FK_54d3488c0c1b2d7db92d1e924fa"`);
        await queryRunner.query(`ALTER TABLE "item_variant" DROP COLUMN "attribute_id"`);
        await queryRunner.query(`ALTER TABLE "item_variant" ADD "attribute_id" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" DROP COLUMN "attribute_id"`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" ADD "attribute_id" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item_variant" RENAME COLUMN "attribute_id" TO "attribute_name"`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" RENAME COLUMN "attribute_id" TO "attribute_name"`);
        await queryRunner.query(`ALTER TABLE "item_variant" ADD CONSTRAINT "FK_13b6f223fe77ba030669dd80b8a" FOREIGN KEY ("attribute_name") REFERENCES "item_attribute_master"("name") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" ADD CONSTRAINT "FK_eb99f6e0f797eb778da27818139" FOREIGN KEY ("attribute_name") REFERENCES "item_attribute_master"("name") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
