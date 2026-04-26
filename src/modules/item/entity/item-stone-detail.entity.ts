import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { StoneFamily } from '../../stone-master/entity/stone-family.entity';
import { StoneClarity } from '../../stone-master/entity/stone-clarity.entity';
import { StoneShape } from '../../stone-master/entity/stone-shape.entity';

@Entity('item_stone_detail')
export class ItemStoneDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.stone_details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ type: 'int' })
  item_id: number;

  @ManyToOne(() => StoneFamily, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'stone_family_id' })
  stone_family: StoneFamily;

  @Column({ type: 'int' })
  stone_family_id: number;

  @ManyToOne(() => StoneClarity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'stone_clarity_id' })
  stone_clarity: StoneClarity;

  @Column({ type: 'int', nullable: true })
  stone_clarity_id: number | null;

  @ManyToOne(() => StoneShape, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'stone_shape_id' })
  stone_shape: StoneShape;

  @Column({ type: 'int' })
  stone_shape_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  weight_carat: number;
}
