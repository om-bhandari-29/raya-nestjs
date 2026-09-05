import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ProductBlueprint } from './product-blueprint.entity';
import { SubCategory } from 'src/modules/sub-category/entity/sub-category.entity';

@Entity('product_designs')
@Unique(['design_slug'])
export class ProductDesign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  design_slug: string;

  @OneToOne(() => SubCategory)
  @JoinColumn({ name: 'sub_category_id' })
  sub_category: SubCategory;

  @OneToMany(() => ProductBlueprint, (blueprint) => blueprint.design)
  blueprints: ProductBlueprint[];
}
