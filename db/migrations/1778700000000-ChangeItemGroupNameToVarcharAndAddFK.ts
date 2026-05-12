import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeItemGroupNameToVarcharAndAddFK1778700000000 implements MigrationInterface {
  name = 'ChangeItemGroupNameToVarcharAndAddFK1778700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the original FK that linked to item_group.id (integer)
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT IF EXISTS "FK_sub_category_item_group"`,
    );

    // Drop new FK if somehow it already exists
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT IF EXISTS "FK_sub_category_item_group_name"`,
    );

    // Change column type from int to varchar(255)
    await queryRunner.query(
      `ALTER TABLE "sub_category" ALTER COLUMN "item_group_name" TYPE varchar(255) USING item_group_name::text`,
    );

    // Add FK referencing item_group.name_frappe_based_id
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD CONSTRAINT "FK_sub_category_item_group_name"
       FOREIGN KEY ("item_group_name") REFERENCES "item_group"("name_frappe_based_id")
       ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT IF EXISTS "FK_sub_category_item_group_name"`,
    );

    await queryRunner.query(
      `ALTER TABLE "sub_category" ALTER COLUMN "item_group_name" TYPE int USING item_group_name::integer`,
    );
  }
}
