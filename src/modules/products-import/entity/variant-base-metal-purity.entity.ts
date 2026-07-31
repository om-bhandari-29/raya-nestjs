import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ProductBlueprint } from './product-blueprint.entity';
import {
  GoldPurityCodeEnum,
  SilverPurityCodeEnum,
  PlatinumPurityCodeEnum,
} from '../../../core/enum/metal-purity.enum';

const CombinedPurityEnumValues = [
  ...Object.values(GoldPurityCodeEnum),
  ...Object.values(SilverPurityCodeEnum),
  ...Object.values(PlatinumPurityCodeEnum),
];

export type BaseMetalPurityType =
  | GoldPurityCodeEnum
  | SilverPurityCodeEnum
  | PlatinumPurityCodeEnum;

@Entity('variant_base_metal_purity')
export class VariantBaseMetalPurity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'variant_id' })
  variant_id: number;

  @OneToOne(() => ProductBlueprint, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductBlueprint;

  @Column({
    type: 'enum',
    enum: CombinedPurityEnumValues,
  })
  purity: BaseMetalPurityType;
}
