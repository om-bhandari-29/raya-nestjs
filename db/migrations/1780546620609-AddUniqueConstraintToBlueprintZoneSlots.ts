import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraintToBlueprintZoneSlots1780546620609 implements MigrationInterface {
    name = 'AddUniqueConstraintToBlueprintZoneSlots1780546620609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" ADD CONSTRAINT "UQ_a3e393fb5f6e8265080ff6c40bc" UNIQUE ("blueprint_id", "zone_name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blueprint_zone_slots" DROP CONSTRAINT "UQ_a3e393fb5f6e8265080ff6c40bc"`);
    }

}
