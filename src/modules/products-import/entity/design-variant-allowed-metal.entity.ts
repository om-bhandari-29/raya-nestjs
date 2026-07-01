import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ProductBlueprint } from './product-blueprint.entity';
import { MetalPurity } from '../../../core/enum/metal-purity.enum';
import { MetalColor } from '../../../core/enum/metal-color.enum';

@Entity('design_variant_allowed_metals')
@Unique(['variant_id', 'metal_purity', 'metal_color'])
export class DesignVariantAllowedMetal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductBlueprint, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductBlueprint;

  @Column({ type: 'int' })
  variant_id: number;

  @Column({ type: 'enum', enum: MetalPurity })
  metal_purity: MetalPurity;

  @Column({ type: 'enum', enum: MetalColor })
  metal_color: MetalColor;
}
