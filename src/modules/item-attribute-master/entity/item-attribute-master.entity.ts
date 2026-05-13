import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemAttributeValue } from './item-attribute-value.entity';

@Entity('item_attribute_master')
export class ItemAttributeMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'boolean', default: false })
  is_base_attribute: boolean;

  @Column({ type: 'boolean', default: false })
  numeric_values: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  from_range: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  to_range: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  increment: number;

  @OneToMany(() => ItemAttributeValue, (value) => value.attribute, {
    cascade: true,
  })
  values: ItemAttributeValue[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
