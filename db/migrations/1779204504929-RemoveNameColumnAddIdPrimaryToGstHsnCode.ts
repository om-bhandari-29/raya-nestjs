import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNameColumnAddIdPrimaryToGstHsnCode1779204504929 implements MigrationInterface {
    name = 'RemoveNameColumnAddIdPrimaryToGstHsnCode1779204504929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_3323c3d5e5ccf07d03fe88bab73"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "hsn_sac_id"`);
        await queryRunner.query(`ALTER TABLE "item" ADD "hsn_sac_id" integer`);
        await queryRunner.query(`ALTER TABLE "gst_hsn_code" DROP CONSTRAINT "PK_gst_hsn_code_name"`);
        await queryRunner.query(`ALTER TABLE "gst_hsn_code" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "gst_hsn_code" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "gst_hsn_code" ADD CONSTRAINT "PK_3523cd48acdea15e5520d5b73c1" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_3323c3d5e5ccf07d03fe88bab73" FOREIGN KEY ("hsn_sac_id") REFERENCES "gst_hsn_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_3323c3d5e5ccf07d03fe88bab73"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "hsn_sac_id"`);
        await queryRunner.query(`ALTER TABLE "item" ADD "hsn_sac_id" character varying`);
        await queryRunner.query(`ALTER TABLE "gst_hsn_code" DROP CONSTRAINT "PK_3523cd48acdea15e5520d5b73c1"`);
        await queryRunner.query(`ALTER TABLE "gst_hsn_code" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "gst_hsn_code" ADD "name" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "gst_hsn_code" ADD CONSTRAINT "PK_gst_hsn_code_name" PRIMARY KEY ("name")`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_3323c3d5e5ccf07d03fe88bab73" FOREIGN KEY ("hsn_sac_id") REFERENCES "gst_hsn_code"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
