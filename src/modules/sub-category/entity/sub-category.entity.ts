import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemGroup } from '../../item-group/entity/item-group.entity';

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, type: 'varchar', unique: true })
  name: string;

  @ManyToOne(() => ItemGroup)
  @JoinColumn({
    name: 'item_group_name',
    referencedColumnName: 'name',
  })
  item_group: ItemGroup;

  @Column({ type: 'varchar', length: 255 })
  item_group_name: string;

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
