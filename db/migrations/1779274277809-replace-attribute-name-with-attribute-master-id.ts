import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceAttributeNameWithAttributeMasterId1779274277809 implements MigrationInterface {
    name = 'ReplaceAttributeNameWithAttributeMasterId1779274277809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_attribute_value" DROP CONSTRAINT "FK_54d3488c0c1b2d7db92d1e924fa"`);
        await queryRunner.query(`ALTER TABLE "item_variant" DROP CONSTRAINT "FK_82db831bafaeade42081c2611fb"`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" RENAME COLUMN "attribute_id" TO "attribute_master_id"`);
        await queryRunner.query(`ALTER TABLE "item_variant" RENAME COLUMN "attribute_id" TO "attribute_master_id"`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" ADD CONSTRAINT "FK_712db3fa030c1527c32d56012e1" FOREIGN KEY ("attribute_master_id") REFERENCES "item_attribute_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_variant" ADD CONSTRAINT "FK_aa776cd641d9f69c4bc14d21350" FOREIGN KEY ("attribute_master_id") REFERENCES "item_attribute_master"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_variant" DROP CONSTRAINT "FK_aa776cd641d9f69c4bc14d21350"`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" DROP CONSTRAINT "FK_712db3fa030c1527c32d56012e1"`);
        await queryRunner.query(`ALTER TABLE "item_variant" RENAME COLUMN "attribute_master_id" TO "attribute_id"`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" RENAME COLUMN "attribute_master_id" TO "attribute_id"`);
        await queryRunner.query(`ALTER TABLE "item_variant" ADD CONSTRAINT "FK_82db831bafaeade42081c2611fb" FOREIGN KEY ("attribute_id") REFERENCES "item_attribute_master"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_attribute_value" ADD CONSTRAINT "FK_54d3488c0c1b2d7db92d1e924fa" FOREIGN KEY ("attribute_id") REFERENCES "item_attribute_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
