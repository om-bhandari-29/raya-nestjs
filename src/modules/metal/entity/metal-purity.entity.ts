import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MetalColor } from './metal-color.entity';

@Entity('metal_purities')
export class MetalPurity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, type: 'varchar' })
  purity: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  name: string;

  @ManyToOne(() => MetalColor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'metal_id' })
  metal: MetalColor;

  @Column({ type: 'int' })
  metal_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  percentage: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, nullable: true })
  rate_per_gram_inr: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, nullable: true })
  rate_per_gram_usd: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}

