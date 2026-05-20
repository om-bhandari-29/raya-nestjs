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
  @JoinColumn({ name: 'attribute_master_id' })
  attribute: ItemAttributeMaster;

  @Column({ type: 'int' })
  attribute_master_id: number;

  @Column({ length: 255, type: 'varchar' })
  name: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  type: string | null;

  @Column({ length: 50, type: 'varchar', nullable: true })
  abbreviation: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0 })
  purity_factor: number;
}
