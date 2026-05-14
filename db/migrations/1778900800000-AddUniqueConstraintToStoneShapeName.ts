import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintToStoneShapeName1778900800000
  implements MigrationInterface
{
  name = 'AddUniqueConstraintToStoneShapeName1778900800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stone_shape" ADD CONSTRAINT "UQ_stone_shape_name" UNIQUE ("name")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stone_shape" DROP CONSTRAINT "UQ_stone_shape_name"`);
  }
}
