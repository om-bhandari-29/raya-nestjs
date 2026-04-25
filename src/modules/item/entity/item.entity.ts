import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductMaster } from '../../product-master/entity/product-master.entity';
import { ItemGroup } from '../../item-group/entity/item-group.entity';
import { GstHsnCode } from '../../gst-hsn-code/entity/gst-hsn-code.entity';
import { Uom } from '../../uom/entity/uom.entity';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductMaster)
  @JoinColumn({ name: 'product_master_id' })
  product_master: ProductMaster;

  @Column({ type: 'int' })
  product_master_id: number;

  @Column({ length: 255, type: 'varchar' })
  name: string;

  @ManyToOne(() => ItemGroup)
  @JoinColumn({ name: 'item_group_id' })
  item_group: ItemGroup;

  @Column({ type: 'int' })
  item_group_id: number;

  @ManyToOne(() => GstHsnCode, { nullable: true })
  @JoinColumn({ name: 'hsn_sac_id' })
  hsn_sac: GstHsnCode;

  @Column({ type: 'int', nullable: true })
  hsn_sac_id: number | null;

  @ManyToOne(() => Uom, { nullable: true })
  @JoinColumn({ name: 'default_uom_id' })
  default_uom: Uom;

  @Column({ type: 'int', nullable: true })
  default_uom_id: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fixed_qty: number;

  @Column({ type: 'boolean', default: false })
  is_disabled: boolean;

  @Column({ type: 'boolean', default: false })
  allow_alternative_item: boolean;

  @Column({ type: 'boolean', default: true })
  maintain_stock: boolean;

  @Column({ type: 'boolean', default: false })
  is_in_stock: boolean;

  @Column({ type: 'boolean', default: false })
  has_variants: boolean;

  @Column({ type: 'int', default: 0 })
  estimated_delivery_days: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valuation_rate: number;

  @Column({ type: 'boolean', default: false })
  is_fixed_asset: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0 })
  over_delivery_receipt_allowance: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0 })
  over_billing_allowance: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
