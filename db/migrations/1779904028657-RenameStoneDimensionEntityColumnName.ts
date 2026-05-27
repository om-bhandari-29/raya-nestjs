import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameStoneDimensionEntityColumnName1779904028657 implements MigrationInterface {
    name = 'RenameStoneDimensionEntityColumnName1779904028657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "estimatedWeightInCt"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "pricePerCt"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "pricePerCtUsd"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "stoneName"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "cutStyle"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "clarity"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "colour"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "stoneType"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "enhancementTreatment"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "sourceFile"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "sizeRange"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "Stone_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "Cut_Style" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "Clarity_grade" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "Colour_grade" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "Stone_type" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "family" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "Enhancement" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "Source_File" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "Size_Range" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "Estimated_Weight_Final_ct" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "Price_per_ct_INR" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "Price_per_ct_USD" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "Price_per_ct_USD"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "Price_per_ct_INR"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "Estimated_Weight_Final_ct"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "Size_Range"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "Source_File"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "Enhancement"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "family"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "Stone_type"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "Colour_grade"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "Clarity_grade"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "Cut_Style"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" DROP COLUMN "Stone_name"`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "sizeRange" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "sourceFile" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "enhancementTreatment" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "stoneType" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "colour" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "clarity" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "cutStyle" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "stoneName" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "pricePerCtUsd" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "pricePerCt" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stone_dimension" ADD "estimatedWeightInCt" numeric(10,2)`);
    }

}
