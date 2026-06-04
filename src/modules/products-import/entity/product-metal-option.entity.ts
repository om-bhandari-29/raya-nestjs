import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ProductBlueprint } from './product-blueprint.entity';

@Entity('product_metal_options')
@Unique(['blueprint_id', 'metal_purity', 'metal_color'])
export class ProductMetalOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductBlueprint, (blueprint) => blueprint.metal_options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blueprint_id' })
  blueprint: ProductBlueprint;

  @Column()
  blueprint_id: number;

  @Column({ type: 'varchar', length: 50 })
  metal_purity: string;

  @Column({ type: 'varchar', length: 50 })
  metal_color: string;
}
