import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('item_group')
export class ItemGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'boolean', default: false })
  is_group: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gst_hsn_code: string | null;

  @ManyToOne(() => ItemGroup, { nullable: true })
  @JoinColumn({ name: 'parent_item_group_id' })
  parent_item_group_rel: ItemGroup | null;

  @Column({ type: 'int', nullable: true })
  parent_item_group_id: number | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  liked: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
