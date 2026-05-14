import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintToStoneClarityName1778900700000
  implements MigrationInterface
{
  name = 'AddUniqueConstraintToStoneClarityName1778900700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stone_clarity" ADD CONSTRAINT "UQ_stone_clarity_name" UNIQUE ("name")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stone_clarity" DROP CONSTRAINT "UQ_stone_clarity_name"`);
  }
}
