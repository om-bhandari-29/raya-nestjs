import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ProductBlueprint } from './product-blueprint.entity';

@Entity('metal_weight_matrix')
@Unique(['variant_id', 'ring_size'])
export class MetalWeightMatrix {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductBlueprint, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductBlueprint;

  @Column()
  variant_id: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  ring_size: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 3,
    nullable: true,
    default: 0.0,
  })
  base_metal_weight_gm: number;
}
