import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShapeAndDimsToZoneSlots1781105700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns
    await queryRunner.query(
      `ALTER TABLE "blueprint_zone_slots" ADD COLUMN "shape_normalized" character varying(50) NOT NULL DEFAULT 'round'`,
    );
    await queryRunner.query(
      `ALTER TABLE "blueprint_zone_slots" ADD COLUMN "dim_l_mm" numeric(20,14) DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "blueprint_zone_slots" ADD COLUMN "dim_w_mm" numeric(20,14) DEFAULT NULL`,
    );

    // Drop old unique constraint on (blueprint_id, zone_name)
    await queryRunner.query(
      `ALTER TABLE "blueprint_zone_slots" DROP CONSTRAINT "UQ_a3e393fb5f6e8265080ff6c40bc"`,
    );

    // Add new unique constraint on (blueprint_id, zone_name, shape_normalized)
    await queryRunner.query(
      `ALTER TABLE "blueprint_zone_slots" ADD CONSTRAINT "UQ_blueprint_zone_shape" UNIQUE ("blueprint_id", "zone_name", "shape_normalized")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore old unique constraint
    await queryRunner.query(
      `ALTER TABLE "blueprint_zone_slots" DROP CONSTRAINT "UQ_blueprint_zone_shape"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blueprint_zone_slots" ADD CONSTRAINT "UQ_a3e393fb5f6e8265080ff6c40bc" UNIQUE ("blueprint_id", "zone_name")`,
    );

    // Remove added columns
    await queryRunner.query(
      `ALTER TABLE "blueprint_zone_slots" DROP COLUMN "dim_w_mm"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blueprint_zone_slots" DROP COLUMN "dim_l_mm"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blueprint_zone_slots" DROP COLUMN "shape_normalized"`,
    );
  }
}
