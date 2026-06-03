import { MigrationInterface, QueryRunner } from "typeorm";

export class IncreaseLenghtFordimString1780456034918 implements MigrationInterface {
    name = 'IncreaseLenghtFordimString1780456034918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "engineering_templates" ALTER COLUMN "dim_string" TYPE character varying(62)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "engineering_templates" ALTER COLUMN "dim_string" TYPE character varying(50)`);
    }

}
