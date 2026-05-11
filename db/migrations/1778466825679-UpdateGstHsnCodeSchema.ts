import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGstHsnCodeSchema1778466825679 implements MigrationInterface {
  name = 'UpdateGstHsnCodeSchema1778466825679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop FK on item that references gst_hsn_code(id)
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT IF EXISTS "FK_item_hsn_sac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT IF EXISTS "FK_3323c3d5e5ccf07d03fe88bab73"`,
    );

    // Drop existing primary key on gst_hsn_code
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" DROP CONSTRAINT IF EXISTS "PK_gst_hsn_code"`,
    );

    // Drop id and gst_rate columns
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" DROP COLUMN IF EXISTS "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" DROP COLUMN IF EXISTS "gst_rate"`,
    );

    // Add name column as primary key (stores the hsn_code value)
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ADD COLUMN IF NOT EXISTS "name" character varying(20) NOT NULL DEFAULT ''`,
    );
    // Copy hsn_code into name for existing rows
    await queryRunner.query(
      `UPDATE "gst_hsn_code" SET "name" = "hsn_code" WHERE "name" = ''`,
    );
    // Remove the default now that data is populated
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ALTER COLUMN "name" DROP DEFAULT`,
    );
    // Set name as primary key
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ADD CONSTRAINT "PK_gst_hsn_code_name" PRIMARY KEY ("name")`,
    );

    // Change item.hsn_sac_id from integer to varchar to match new FK target
    await queryRunner.query(
      `ALTER TABLE "item" DROP COLUMN IF EXISTS "hsn_sac_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD COLUMN "hsn_sac_id" character varying`,
    );

    // Re-add FK referencing gst_hsn_code(name)
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_item_hsn_sac" FOREIGN KEY ("hsn_sac_id") REFERENCES "gst_hsn_code"("name") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop new FK
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT IF EXISTS "FK_item_hsn_sac"`,
    );

    // Restore item.hsn_sac_id as integer
    await queryRunner.query(
      `ALTER TABLE "item" DROP COLUMN IF EXISTS "hsn_sac_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD COLUMN "hsn_sac_id" integer`,
    );

    // Drop name primary key
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" DROP CONSTRAINT IF EXISTS "PK_gst_hsn_code_name"`,
    );

    // Drop name column
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" DROP COLUMN IF EXISTS "name"`,
    );

    // Restore id and gst_rate columns
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ADD COLUMN "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ADD CONSTRAINT "PK_gst_hsn_code" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "gst_hsn_code" ADD COLUMN "gst_rate" numeric(5,2) NOT NULL DEFAULT 0`,
    );

    // Restore original FK referencing gst_hsn_code(id)
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_item_hsn_sac" FOREIGN KEY ("hsn_sac_id") REFERENCES "gst_hsn_code"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
