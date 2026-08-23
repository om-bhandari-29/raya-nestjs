import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductMetalOption } from './product-metal-option.entity';
import { BlueprintZoneSlot } from './blueprint-zone-slot.entity';
import { ProductDesign } from './product-design.entity';

@Entity('product_blueprints')
@Unique(['design_id', 'variant_name', 'target_gender'])
export class ProductBlueprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'design_id' })
  design_id: number;

  @ManyToOne(() => ProductDesign, (design) => design.blueprints, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'design_id' })
  design: ProductDesign;

  @Column({ type: 'varchar', length: 100 })
  variant_name: string;

  @Column({ type: 'varchar', length: 20 })
  target_gender: string;

  @Column({ name: 'labour_cost_in_inr', type: 'decimal', precision: 10, scale: 2, default: 0 })
  labour_cost_in_inr: number;
  
  @Column({ name: 'labour_cost_in_usd', type: 'decimal', precision: 10, scale: 2, default: 0 })
  labour_cost_in_usd: number;

  @OneToMany(() => ProductMetalOption, (option) => option.blueprint)
  metal_options: ProductMetalOption[];

  @OneToMany(() => BlueprintZoneSlot, (slot) => slot.blueprint)
  zone_slots: BlueprintZoneSlot[];
}
