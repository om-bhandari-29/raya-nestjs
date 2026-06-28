import { MigrationInterface, QueryRunner } from "typeorm";

export class NormalizeProductBlueprintDesign1781105800000 implements MigrationInterface {
    name = 'NormalizeProductBlueprintDesign1781105800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create product_designs table
        await queryRunner.query(
            `CREATE TABLE "product_designs" (
                "id" SERIAL NOT NULL, 
                "design_slug" character varying(100) NOT NULL, 
                CONSTRAINT "UQ_product_designs_design_slug" UNIQUE ("design_slug"), 
                CONSTRAINT "PK_product_designs_id" PRIMARY KEY ("id")
            )`
        );

        // 2. Populate product_designs with unique design_slug values from product_blueprints
        await queryRunner.query(
            `INSERT INTO "product_designs" ("design_slug") 
             SELECT DISTINCT "design_slug" FROM "product_blueprints"`
        );

        // 3. Add design_id to product_blueprints (nullable first)
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" ADD COLUMN "design_id" integer`
        );

        // 4. Update product_blueprints with corresponding design_id
        await queryRunner.query(
            `UPDATE "product_blueprints" pb 
             SET "design_id" = pd.id 
             FROM "product_designs" pd 
             WHERE pb.design_slug = pd.design_slug`
        );

        // 5. Make design_id NOT NULL
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" ALTER COLUMN "design_id" SET NOT NULL`
        );

        // 6. Drop old unique constraint
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" DROP CONSTRAINT "UQ_513613ce668f4af73c942085130"`
        );

        // 7. Add foreign key constraint to product_designs
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" ADD CONSTRAINT "FK_product_blueprints_design_id" 
             FOREIGN KEY ("design_id") REFERENCES "product_designs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );

        // 8. Add new unique constraint
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" ADD CONSTRAINT "UQ_product_blueprints_design_variant_gender" 
             UNIQUE ("design_id", "variant_name", "target_gender")`
        );

        // 9. Drop the old design_slug column
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" DROP COLUMN "design_slug"`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Add design_slug back to product_blueprints (nullable first)
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" ADD COLUMN "design_slug" character varying(100)`
        );

        // 2. Restore design_slug values from product_designs
        await queryRunner.query(
            `UPDATE "product_blueprints" pb 
             SET "design_slug" = pd.design_slug 
             FROM "product_designs" pd 
             WHERE pb.design_id = pd.id`
        );

        // 3. Make design_slug NOT NULL
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" ALTER COLUMN "design_slug" SET NOT NULL`
        );

        // 4. Drop new unique constraint
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" DROP CONSTRAINT "UQ_product_blueprints_design_variant_gender"`
        );

        // 5. Drop foreign key constraint
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" DROP CONSTRAINT "FK_product_blueprints_design_id"`
        );

        // 6. Restore old unique constraint
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" ADD CONSTRAINT "UQ_513613ce668f4af73c942085130" 
             UNIQUE ("design_slug", "variant_name", "target_gender")`
        );

        // 7. Drop design_id column
        await queryRunner.query(
            `ALTER TABLE "product_blueprints" DROP COLUMN "design_id"`
        );

        // 8. Drop product_designs table
        await queryRunner.query(
            `DROP TABLE "product_designs"`
        );
    }
}
