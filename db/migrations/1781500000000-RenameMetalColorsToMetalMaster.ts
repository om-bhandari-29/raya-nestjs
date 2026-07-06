import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameMetalColorsToMetalMaster1781500000000
  implements MigrationInterface
{
  name = 'RenameMetalColorsToMetalMaster1781500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Check if the old table exists and the new table does NOT exist
    const oldTableExists = await queryRunner.hasTable('metal_colors');
    const newTableExists = await queryRunner.hasTable('metal_master');

    if (oldTableExists && !newTableExists) {
      // Rename table
      await queryRunner.query(`ALTER TABLE "metal_colors" RENAME TO "metal_master"`);

      // Rename primary key constraint if it exists
      const pkExists = await queryRunner.query(`
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'PK_metal_colors'
      `);
      if (pkExists.length > 0) {
        await queryRunner.query(`ALTER TABLE "metal_master" RENAME CONSTRAINT "PK_metal_colors" TO "PK_metal_master"`);
      }
    }

    // 2. Perform actions on metal_master
    const targetTableExists = await queryRunner.hasTable('metal_master');
    if (targetTableExists) {
      // Check if code column exists in the table
      const hasCodeColumn = await queryRunner.query(`
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'metal_master' AND column_name = 'code'
      `);

      if (hasCodeColumn.length > 0) {
        // First, check and drop UQ constraint if it exists
        const uqExists = await queryRunner.query(`
          SELECT conname FROM pg_constraint 
          WHERE conname IN ('UQ_metal_colors_code', 'UQ_metal_master_code')
        `);
        for (const row of uqExists) {
          await queryRunner.query(`ALTER TABLE "metal_master" DROP CONSTRAINT IF EXISTS "${row.conname}"`);
        }

        // Drop column
        await queryRunner.query(`ALTER TABLE "metal_master" DROP COLUMN "code"`);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const newTableExists = await queryRunner.hasTable('metal_master');
    const oldTableExists = await queryRunner.hasTable('metal_colors');

    if (newTableExists) {
      // Restore code column if it was dropped
      const hasCodeColumn = await queryRunner.query(`
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'metal_master' AND column_name = 'code'
      `);

      if (hasCodeColumn.length === 0) {
        await queryRunner.query(`
          ALTER TABLE "metal_master" 
          ADD COLUMN "code" character varying(20)
        `);

        // Backfill name to code or set dummy values so NOT NULL / UNIQUE constraint doesn't fail
        await queryRunner.query(`
          UPDATE "metal_master" 
          SET "code" = UPPER(SUBSTRING("name", 1, 20))
        `);

        await queryRunner.query(`
          ALTER TABLE "metal_master" 
          ALTER COLUMN "code" SET NOT NULL
        `);

        await queryRunner.query(`
          ALTER TABLE "metal_master" 
          ADD CONSTRAINT "UQ_metal_master_code" UNIQUE ("code")
        `);
      }

      // Rename table back if old table doesn't exist
      if (!oldTableExists) {
        await queryRunner.query(`ALTER TABLE "metal_master" RENAME TO "metal_colors"`);

        const pkExists = await queryRunner.query(`
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'PK_metal_master'
        `);
        if (pkExists.length > 0) {
          await queryRunner.query(`ALTER TABLE "metal_colors" RENAME CONSTRAINT "PK_metal_master" TO "PK_metal_colors"`);
        }

        // Rename the constraint back to old name
        const uqExists = await queryRunner.query(`
          SELECT conname FROM pg_constraint 
          WHERE conname = 'UQ_metal_master_code'
        `);
        if (uqExists.length > 0) {
          await queryRunner.query(`
            ALTER TABLE "metal_colors" 
            RENAME CONSTRAINT "UQ_metal_master_code" TO "UQ_metal_colors_code"
          `);
        }
      }
    }
  }
}
