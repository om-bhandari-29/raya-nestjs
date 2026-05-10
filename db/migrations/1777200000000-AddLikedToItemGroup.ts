import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLikedToItemGroup1777200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_group" ADD COLUMN "liked" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_group" DROP COLUMN "liked"`);
  }
}
