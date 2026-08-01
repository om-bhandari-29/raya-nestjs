import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MetalType } from '../../../core/enum/metal-type.enum';

@Entity('metal_purities')
export class MetalPurity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, type: 'varchar' })
  purity: string;

  @Index()
  @Column({ length: 50, type: 'varchar', nullable: true })
  purity_code: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'int', enum: MetalType })
  metal_type: MetalType;

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
