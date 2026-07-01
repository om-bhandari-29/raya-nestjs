import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDesignVariantAllowedMetalsTable1781200000000
  implements MigrationInterface
{
  name = 'CreateDesignVariantAllowedMetalsTable1781200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create PostgreSQL enum types
    await queryRunner.query(
      `CREATE TYPE "public"."metal_purity_enum" AS ENUM('GOLD_14K', 'GOLD_18K', 'PLATINUM_950')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."metal_color_enum" AS ENUM('YELLOW', 'WHITE', 'ROSE', 'PLATINUM')`,
    );

    // 2. Create design_variant_allowed_metals table
    await queryRunner.query(
      `CREATE TABLE "design_variant_allowed_metals" (
        "id" SERIAL NOT NULL,
        "variant_id" integer NOT NULL,
        "metal_purity" "public"."metal_purity_enum" NOT NULL,
        "metal_color" "public"."metal_color_enum" NOT NULL,
        CONSTRAINT "UQ_design_variant_allowed_metals_variant_purity_color"
          UNIQUE ("variant_id", "metal_purity", "metal_color"),
        CONSTRAINT "PK_design_variant_allowed_metals_id"
          PRIMARY KEY ("id")
      )`,
    );

    // 3. Add FK: variant_id → product_blueprints(id)
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        ADD CONSTRAINT "FK_design_variant_allowed_metals_variant_id"
        FOREIGN KEY ("variant_id")
        REFERENCES "product_blueprints"("id")
        ON DELETE CASCADE
        ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop FK
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        DROP CONSTRAINT "FK_design_variant_allowed_metals_variant_id"`,
    );

    // 2. Drop table
    await queryRunner.query(`DROP TABLE "design_variant_allowed_metals"`);

    // 3. Drop enum types
    await queryRunner.query(`DROP TYPE "public"."metal_color_enum"`);
    await queryRunner.query(`DROP TYPE "public"."metal_purity_enum"`);
  }
}
