import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { ItemAttributeMaster } from '../../item-attribute-master/entity/item-attribute-master.entity';
import { ItemAttributeValue } from '../../item-attribute-master/entity/item-attribute-value.entity';

@Entity('item_variant')
export class ItemVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ type: 'int' })
  item_id: number;

  @ManyToOne(() => Item, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'variant_of_id' })
  variant_of: Item;

  @Column({ type: 'int', nullable: true })
  variant_of_id: number | null;

  @ManyToOne(() => ItemAttributeMaster, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'attribute_id' })
  attribute: ItemAttributeMaster;

  @Column({ type: 'int' })
  attribute_id: number;

  @ManyToOne(() => ItemAttributeValue, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'value_id' })
  value: ItemAttributeValue;

  @Column({ type: 'int' })
  value_id: number;

  @Column({ type: 'boolean', default: false })
  is_disabled: boolean;

  @Column({ length: 255, type: 'varchar', nullable: true })
  stone_family: string | null;

  @Column({ length: 255, type: 'varchar', nullable: true })
  stone_id: string | null;
}
