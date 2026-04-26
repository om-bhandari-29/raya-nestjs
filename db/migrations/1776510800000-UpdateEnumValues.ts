import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEnumValues1776510800000 implements MigrationInterface {
  name = 'UpdateEnumValues1776510800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update material_request_type_enum
    await queryRunner.query(`ALTER TYPE material_request_type_enum RENAME TO material_request_type_enum_old`);
    await queryRunner.query(`CREATE TYPE material_request_type_enum AS ENUM ('purchase', 'material_transfer', 'material_issue', 'manufacture', 'customer_provided')`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "default_material_request_type" DROP DEFAULT`);
    await queryRunner.query(`
      ALTER TABLE "item" ALTER COLUMN "default_material_request_type" TYPE material_request_type_enum USING (
        CASE "default_material_request_type"::text
          WHEN 'Purchase' THEN 'purchase'
          WHEN 'Material Transfer' THEN 'material_transfer'
          WHEN 'Material Issue' THEN 'material_issue'
          WHEN 'Manufacture' THEN 'manufacture'
          WHEN 'Customer Provided' THEN 'customer_provided'
          ELSE 'purchase'
        END
      )::material_request_type_enum
    `);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "default_material_request_type" SET DEFAULT 'purchase'`);
    await queryRunner.query(`DROP TYPE material_request_type_enum_old`);

    // Update valuation_method_enum
    await queryRunner.query(`ALTER TYPE valuation_method_enum RENAME TO valuation_method_enum_old`);
    await queryRunner.query(`CREATE TYPE valuation_method_enum AS ENUM ('fifo', 'moving_average', 'lifo')`);
    await queryRunner.query(`
      ALTER TABLE "item" ALTER COLUMN "valuation_method" TYPE valuation_method_enum USING (
        CASE "valuation_method"::text
          WHEN 'FIFO' THEN 'fifo'
          WHEN 'Moving Average' THEN 'moving_average'
          WHEN 'LIFO' THEN 'lifo'
          ELSE NULL
        END
      )::valuation_method_enum
    `);
    await queryRunner.query(`DROP TYPE valuation_method_enum_old`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert valuation_method_enum
    await queryRunner.query(`ALTER TYPE valuation_method_enum RENAME TO valuation_method_enum_old`);
    await queryRunner.query(`CREATE TYPE valuation_method_enum AS ENUM ('FIFO', 'Moving Average', 'LIFO')`);
    await queryRunner.query(`
      ALTER TABLE "item" ALTER COLUMN "valuation_method" TYPE valuation_method_enum USING (
        CASE "valuation_method"::text
          WHEN 'fifo' THEN 'FIFO'
          WHEN 'moving_average' THEN 'Moving Average'
          WHEN 'lifo' THEN 'LIFO'
          ELSE NULL
        END
      )::valuation_method_enum
    `);
    await queryRunner.query(`DROP TYPE valuation_method_enum_old`);

    // Revert material_request_type_enum
    await queryRunner.query(`ALTER TYPE material_request_type_enum RENAME TO material_request_type_enum_old`);
    await queryRunner.query(`CREATE TYPE material_request_type_enum AS ENUM ('Purchase', 'Material Transfer', 'Material Issue', 'Manufacture', 'Customer Provided')`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "default_material_request_type" DROP DEFAULT`);
    await queryRunner.query(`
      ALTER TABLE "item" ALTER COLUMN "default_material_request_type" TYPE material_request_type_enum USING (
        CASE "default_material_request_type"::text
          WHEN 'purchase' THEN 'Purchase'
          WHEN 'material_transfer' THEN 'Material Transfer'
          WHEN 'material_issue' THEN 'Material Issue'
          WHEN 'manufacture' THEN 'Manufacture'
          WHEN 'customer_provided' THEN 'Customer Provided'
          ELSE 'Purchase'
        END
      )::material_request_type_enum
    `);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "default_material_request_type" SET DEFAULT 'Purchase'`);
    await queryRunner.query(`DROP TYPE material_request_type_enum_old`);
  }
}
