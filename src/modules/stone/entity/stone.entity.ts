import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class Stone {
  @PrimaryGeneratedColumn()
  id: number;

  // String fields
  @Column({ length: 100, type: 'varchar' })
  shape: string;

  @Column({ length: 100, type: 'varchar' })
  stoneName: string;

  @Column({ length: 100, type: 'varchar' })
  cutStyle: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  origin: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  clarity: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  colour: string;

  @Column({ length: 100, type: 'varchar' })
  stoneType: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  cutGrade: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  countryOrigin: string;

  @Column({ length: 200, type: 'varchar', nullable: true })
  enhancementTreatment: string;

  @Column({ length: 255, type: 'varchar', nullable: true })
  sourceFile: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  sizeRange: string;

  // Number fields
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedWeightInCt: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerCt: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerCtUsd: number;

  // Generated key field
  @Column({ length: 500, type: 'varchar', unique: true })
  generatedKey: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateKey() {
    const formatDimension = (value: number | null | undefined): string => {
      return value !== null && value !== undefined ? Number(value).toFixed(2) : '0.00';
    };

    const parts = [
      this.stoneName || '',
      this.shape || '',
      this.stoneType || '',
      this.cutStyle || '',
      this.cutGrade || '',
      this.colour || '',
      this.enhancementTreatment || '',
      `${formatDimension(this.length)}x${formatDimension(this.width)}x${formatDimension(this.height)}`,
    ];

    this.generatedKey = parts.join('-');
  }
}
