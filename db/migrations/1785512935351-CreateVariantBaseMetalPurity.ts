import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVariantBaseMetalPurity1785512935351 implements MigrationInterface {
    name = 'CreateVariantBaseMetalPurity1785512935351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."variant_base_metal_purity_purity_enum" AS ENUM('24K', '23.7K', '23K', '22K', '18K', '14K', '9K', '8K', 'SV999', 'SV986', 'SV960', 'SV958', 'SV950', 'AU935', 'SV925', 'SV900', 'SV835', 'SV830', 'SV800', 'Pt1000', 'Pt999', 'Pt950', 'Pt900', 'Pt850', 'Pt835')`);
        await queryRunner.query(`CREATE TABLE "variant_base_metal_purity" ("id" SERIAL NOT NULL, "variant_id" integer NOT NULL, "purity" "public"."variant_base_metal_purity_purity_enum" NOT NULL, CONSTRAINT "REL_7954a162af4ace9310e41693d7" UNIQUE ("variant_id"), CONSTRAINT "PK_a97cda1fb3c50670f674eca050c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "variant_base_metal_purity" ADD CONSTRAINT "FK_7954a162af4ace9310e41693d75" FOREIGN KEY ("variant_id") REFERENCES "product_blueprints"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant_base_metal_purity" DROP CONSTRAINT "FK_7954a162af4ace9310e41693d75"`);
        await queryRunner.query(`DROP TABLE "variant_base_metal_purity"`);
        await queryRunner.query(`DROP TYPE "public"."variant_base_metal_purity_purity_enum"`);
    }

}
