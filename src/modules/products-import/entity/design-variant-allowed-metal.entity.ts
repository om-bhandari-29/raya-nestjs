import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ProductBlueprint } from './product-blueprint.entity';
import { MetalPurity } from '../../metal/entity/metal-purity.entity';
import { MetalColor } from '../../metal/entity/metal-color.entity';

@Entity('design_variant_allowed_metals')
@Unique(['variant_id', 'metal_purity_id', 'metal_master_id'])
export class DesignVariantAllowedMetal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductBlueprint, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductBlueprint;

  @Column({ type: 'int' })
  variant_id: number;

  @ManyToOne(() => MetalPurity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'metal_purity_id' })
  metalPurity: MetalPurity;

  @Column({ type: 'int' })
  metal_purity_id: number;

  @ManyToOne(() => MetalColor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'metal_master_id' })
  metalMaster: MetalColor;

  @Column({ type: 'int' })
  metal_master_id: number;
}
