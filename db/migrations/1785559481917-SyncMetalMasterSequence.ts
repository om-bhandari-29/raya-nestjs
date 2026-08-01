import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncMetalMasterSequence1785559481917 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            SELECT setval(pg_get_serial_sequence('metal_master', 'id'), coalesce(max(id),0) + 1, false) FROM metal_master;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
