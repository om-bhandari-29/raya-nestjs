import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateStoneTable1777000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stone',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'shape',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'stoneName',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'cutStyle',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'origin',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'clarity',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'colour',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'stoneType',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'cutGrade',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'countryOrigin',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'enhancementTreatment',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'sourceFile',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'sizeRange',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'length',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'width',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'height',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'estimatedWeightInCt',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'pricePerCt',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'pricePerCtUsd',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'generatedKey',
            type: 'varchar',
            length: '500',
            isUnique: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create index on generatedKey for faster lookups
    await queryRunner.createIndex(
      'stone',
      new TableIndex({
        name: 'IDX_STONE_GENERATED_KEY',
        columnNames: ['generatedKey'],
      }),
    );

    // Create index on stoneName for faster searches
    await queryRunner.createIndex(
      'stone',
      new TableIndex({
        name: 'IDX_STONE_NAME',
        columnNames: ['stoneName'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('stone', 'IDX_STONE_NAME');
    await queryRunner.dropIndex('stone', 'IDX_STONE_GENERATED_KEY');
    await queryRunner.dropTable('stone');
  }
}
