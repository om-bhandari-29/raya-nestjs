import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubCategory } from '../../sub-category/entity/sub-category.entity';

@Entity()
export class ProductMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, type: 'varchar', unique: true })
  name: string;

  @ManyToOne(() => SubCategory)
  @JoinColumn({ name: 'sub_category_id' })
  sub_category: SubCategory;

  @Column({ type: 'int' })
  sub_category_id: number;

  @Column({ type: 'text', nullable: true })
  product_description: string | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
