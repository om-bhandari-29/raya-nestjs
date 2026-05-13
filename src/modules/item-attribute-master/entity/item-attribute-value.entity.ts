import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemAttributeMaster } from './item-attribute-master.entity';

@Entity('item_attribute_value')
export class ItemAttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ItemAttributeMaster, (attr) => attr.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attribute_name', referencedColumnName: 'name' })
  attribute: ItemAttributeMaster;

  @Column({ length: 255, type: 'varchar' })
  attribute_name: string;

  @Column({ length: 255, type: 'varchar' })
  name: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  attribute_type: string | null;

  @Column({ length: 50, type: 'varchar', nullable: true })
  abbreviation: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0 })
  purity_factor: number;
}
