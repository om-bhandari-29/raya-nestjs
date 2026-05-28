import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('stone_dimension')
export class Stone {
  @PrimaryGeneratedColumn()
  id: number;

  // String fields
  @Column({ length: 100, type: 'varchar' })
  shape: string;

  @Column({ name: 'Stone_name', length: 100, type: 'varchar' })
  stoneName: string;

  @Column({ name: 'Cut_Style', length: 100, type: 'varchar' })
  cutStyle: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  origin: string;

  @Column({
    name: 'Clarity_grade',
    length: 100,
    type: 'varchar',
    nullable: true,
  })
  clarity: string;

  @Column({
    name: 'Colour_grade',
    length: 100,
    type: 'varchar',
    nullable: true,
  })
  colour: string;

  @Column({ name: 'Stone_type', length: 100, type: 'varchar' })
  stoneType: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  family: string;

  @Column({ name: 'Enhancement', length: 200, type: 'varchar', nullable: true })
  enhancementTreatment: string;

  @Column({ name: 'Source_File', length: 255, type: 'varchar', nullable: true })
  sourceFile: string;

  @Column({ name: 'Size_Range', length: 100, type: 'varchar', nullable: true })
  sizeRange: string;

  // Number fields
  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
  length: number;

  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
  width: number;

  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
  height: number;

  @Column({
    name: 'Estimated_Weight_Final_ct',
    type: 'decimal',
    precision: 18,
    scale: 8,
    nullable: true,
  })
  estimatedWeightInCt: number;

  @Column({
    name: 'Price_per_ct_INR',
    type: 'decimal',
    precision: 18,
    scale: 8,
    nullable: true,
  })
  pricePerCt: number;

  @Column({
    name: 'Price_per_ct_USD',
    type: 'decimal',
    precision: 18,
    scale: 8,
    nullable: true,
  })
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
      return value !== null && value !== undefined
        ? Number(value).toString()
        : '0';
    };

    // formData.stoneName,
    // formData.shape,
    // formData.stoneType,
    // formData.cutStyle,
    // formData.cutGrade,
    // formData.colour,
    // formData.enhancementTreatment

    const parts = [
      this.stoneName || '',
      this.shape || '',
      this.stoneType || '',
      this.cutStyle || '',
      this.clarity || '',
      this.colour || '',
      this.enhancementTreatment || '',
      `${formatDimension(this.length)}x${formatDimension(this.width)}x${formatDimension(this.height)}`,
    ];

    this.generatedKey = parts.join('-');
  }
}
