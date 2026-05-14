import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintToStoneTypeName1778900600000
  implements MigrationInterface
{
  name = 'AddUniqueConstraintToStoneTypeName1778900600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stone_type" ADD CONSTRAINT "UQ_stone_type_name" UNIQUE ("name")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stone_type" DROP CONSTRAINT "UQ_stone_type_name"`);
  }
}
