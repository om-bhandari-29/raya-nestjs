import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { Uom } from '../../uom/entity/uom.entity';

@Entity('item_barcode')
export class ItemBarcode {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.barcodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ type: 'int' })
  item_id: number;

  @Column({ length: 255, type: 'varchar' })
  barcode: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  barcode_type: string | null;

  @ManyToOne(() => Uom, { nullable: true })
  @JoinColumn({ name: 'uom_id' })
  uom: Uom;

  @Column({ type: 'int', nullable: true })
  uom_id: number | null;
}
