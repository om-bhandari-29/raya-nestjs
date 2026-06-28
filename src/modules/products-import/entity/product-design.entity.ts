import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { ProductBlueprint } from './product-blueprint.entity';

@Entity('product_designs')
@Unique(['design_slug'])
export class ProductDesign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  design_slug: string;

  @OneToMany(() => ProductBlueprint, (blueprint) => blueprint.design)
  blueprints: ProductBlueprint[];
}
