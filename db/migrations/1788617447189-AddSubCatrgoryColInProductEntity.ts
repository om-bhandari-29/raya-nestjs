import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubCatrgoryColInProductEntity1788617447189 implements MigrationInterface {
    name = 'AddSubCatrgoryColInProductEntity1788617447189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_designs" ADD "sub_category_id" integer`);
        await queryRunner.query(`ALTER TABLE "product_designs" ADD CONSTRAINT "UQ_090c598241375a0dedd12216c27" UNIQUE ("sub_category_id")`);
        await queryRunner.query(`ALTER TABLE "product_designs" ADD CONSTRAINT "FK_090c598241375a0dedd12216c27" FOREIGN KEY ("sub_category_id") REFERENCES "sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_designs" DROP CONSTRAINT "FK_090c598241375a0dedd12216c27"`);
        await queryRunner.query(`ALTER TABLE "product_designs" DROP CONSTRAINT "UQ_090c598241375a0dedd12216c27"`);
        await queryRunner.query(`ALTER TABLE "product_designs" DROP COLUMN "sub_category_id"`);
    }

}
