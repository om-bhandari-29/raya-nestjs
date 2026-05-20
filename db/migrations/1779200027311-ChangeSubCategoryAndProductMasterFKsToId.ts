import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeSubCategoryAndProductMasterFKsToId1779200027311 implements MigrationInterface {
    name = 'ChangeSubCategoryAndProductMasterFKsToId1779200027311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_master" DROP CONSTRAINT "FK_ffacc8e15577ac352331903eabb"`);
        await queryRunner.query(`ALTER TABLE "product_master" RENAME COLUMN "sub_category_name" TO "sub_category_id"`);
        await queryRunner.query(`ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_758a22621752d4754a124d7cc5c"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "stone_type_id_seq" OWNED BY "stone_type"."id"`);
        await queryRunner.query(`ALTER TABLE "stone_type" ALTER COLUMN "id" SET DEFAULT nextval('"stone_type_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "product_master" DROP COLUMN "sub_category_id"`);
        await queryRunner.query(`ALTER TABLE "product_master" ADD "sub_category_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_master" ADD CONSTRAINT "FK_9ba3f715d18fd9d2060bccc4f5e" FOREIGN KEY ("sub_category_id") REFERENCES "sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_758a22621752d4754a124d7cc5c" FOREIGN KEY ("stone_type_id") REFERENCES "stone_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_stone_detail" DROP CONSTRAINT "FK_758a22621752d4754a124d7cc5c"`);
        await queryRunner.query(`ALTER TABLE "product_master" DROP CONSTRAINT "FK_9ba3f715d18fd9d2060bccc4f5e"`);
        await queryRunner.query(`ALTER TABLE "product_master" DROP COLUMN "sub_category_id"`);
        await queryRunner.query(`ALTER TABLE "product_master" ADD "sub_category_id" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stone_type" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "stone_type_id_seq"`);
        await queryRunner.query(`ALTER TABLE "item_stone_detail" ADD CONSTRAINT "FK_758a22621752d4754a124d7cc5c" FOREIGN KEY ("stone_type_id") REFERENCES "stone_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_master" RENAME COLUMN "sub_category_id" TO "sub_category_name"`);
        await queryRunner.query(`ALTER TABLE "product_master" ADD CONSTRAINT "FK_ffacc8e15577ac352331903eabb" FOREIGN KEY ("sub_category_name") REFERENCES "sub_category"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
