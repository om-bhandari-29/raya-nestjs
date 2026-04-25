import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductMaster } from '../../product-master/entity/product-master.entity';
import { ItemGroup } from '../../item-group/entity/item-group.entity';
import { GstHsnCode } from '../../gst-hsn-code/entity/gst-hsn-code.entity';
import { Uom } from '../../uom/entity/uom.entity';
import { MaterialRequestTypeEnum } from '../../../core/enum/material-request-type.enum';
import { ValuationMethodEnum } from '../../../core/enum/valuation-method.enum';
import { ItemBarcode } from './item-barcode.entity';
import { ItemVariant } from './item-variant.entity';

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

  // Inventory Settings
  @Column({ type: 'int', default: 0 })
  shelf_life_in_days: number;

  @Column({ type: 'int', nullable: true })
  warranty_period_in_days: number | null;

  @Column({ type: 'date', default: '2099-12-31' })
  end_of_life: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  weight_per_unit: number;

  @ManyToOne(() => Uom, { nullable: true })
  @JoinColumn({ name: 'weight_uom_id' })
  weight_uom: Uom;

  @Column({ type: 'int', nullable: true })
  weight_uom_id: number | null;

  @Column({
    type: 'enum',
    enum: MaterialRequestTypeEnum,
    default: MaterialRequestTypeEnum.purchase,
  })
  default_material_request_type: MaterialRequestTypeEnum;

  @Column({
    type: 'enum',
    enum: ValuationMethodEnum,
    nullable: true,
  })
  valuation_method: ValuationMethodEnum | null;

  @Column({ type: 'boolean', default: false })
  allow_negative_stock: boolean;

  // Barcodes
  @OneToMany(() => ItemBarcode, (barcode) => barcode.item, { cascade: true })
  barcodes: ItemBarcode[];

  // Variants
  @Column({ type: 'varchar', length: 255, nullable: true })
  stones: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  gross_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  net_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  stones_weight_in_gram: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  stone_carat_wt: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  pure_weight_metal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  labor_rate: number;

  @OneToMany(() => ItemVariant, (variant) => variant.item, { cascade: true })
  variants: ItemVariant[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
