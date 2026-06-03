import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedPlacementColToAccept100CharAndNullable1780468528466 implements MigrationInterface {
    name = 'UpdatedPlacementColToAccept100CharAndNullable1780468528466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "engineering_templates" DROP COLUMN "placement"`);
        await queryRunner.query(`ALTER TABLE "engineering_templates" ADD "placement" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "engineering_templates" DROP COLUMN "placement"`);
        await queryRunner.query(`ALTER TABLE "engineering_templates" ADD "placement" character varying(50) NOT NULL`);
    }

}
