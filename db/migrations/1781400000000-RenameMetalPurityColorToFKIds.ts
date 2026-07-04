import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameMetalPurityColorToFKIds1781400000000
  implements MigrationInterface
{
  name = 'RenameMetalPurityColorToFKIds1781400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop the existing unique constraint
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        DROP CONSTRAINT "UQ_design_variant_allowed_metals_variant_purity_color"`,
    );

    // 2. Drop old enum columns
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        DROP COLUMN "metal_purity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        DROP COLUMN "metal_color"`,
    );

    // 3. Add new integer FK columns
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        ADD COLUMN "metal_purity_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        ADD COLUMN "metal_color_id" integer NOT NULL`,
    );

    // 4. Add FK: metal_purity_id → metal_purities(id)
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        ADD CONSTRAINT "FK_design_variant_allowed_metals_metal_purity_id"
        FOREIGN KEY ("metal_purity_id")
        REFERENCES "metal_purities"("id")
        ON DELETE CASCADE
        ON UPDATE NO ACTION`,
    );

    // 5. Add FK: metal_color_id → metal_colors(id)
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        ADD CONSTRAINT "FK_design_variant_allowed_metals_metal_color_id"
        FOREIGN KEY ("metal_color_id")
        REFERENCES "metal_colors"("id")
        ON DELETE CASCADE
        ON UPDATE NO ACTION`,
    );

    // 6. Re-create unique constraint with new column names
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        ADD CONSTRAINT "UQ_design_variant_allowed_metals_variant_purity_color"
        UNIQUE ("variant_id", "metal_purity_id", "metal_color_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop new unique constraint
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        DROP CONSTRAINT "UQ_design_variant_allowed_metals_variant_purity_color"`,
    );

    // 2. Drop FKs
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        DROP CONSTRAINT "FK_design_variant_allowed_metals_metal_color_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        DROP CONSTRAINT "FK_design_variant_allowed_metals_metal_purity_id"`,
    );

    // 3. Drop new columns
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        DROP COLUMN "metal_color_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        DROP COLUMN "metal_purity_id"`,
    );

    // 4. Re-add old enum columns
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        ADD COLUMN "metal_purity" "public"."metal_purity_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        ADD COLUMN "metal_color" "public"."metal_color_enum" NOT NULL`,
    );

    // 5. Re-create old unique constraint
    await queryRunner.query(
      `ALTER TABLE "design_variant_allowed_metals"
        ADD CONSTRAINT "UQ_design_variant_allowed_metals_variant_purity_color"
        UNIQUE ("variant_id", "metal_purity", "metal_color")`,
    );
  }
}
