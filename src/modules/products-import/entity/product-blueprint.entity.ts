import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { ProductMetalOption } from './product-metal-option.entity';
import { BlueprintZoneSlot } from './blueprint-zone-slot.entity';

@Entity('product_blueprints')
@Unique(['design_slug', 'variant_name', 'target_gender'])
export class ProductBlueprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  design_slug: string;

  @Column({ type: 'varchar', length: 100 })
  variant_name: string;

  @Column({ type: 'varchar', length: 20 })
  target_gender: string;

  @OneToMany(() => ProductMetalOption, (option) => option.blueprint)
  metal_options: ProductMetalOption[];

  @OneToMany(() => BlueprintZoneSlot, (slot) => slot.blueprint)
  zone_slots: BlueprintZoneSlot[];
}
