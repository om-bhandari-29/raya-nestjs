import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('engineering_templates')
export class EngineeringTemplate {
  @PrimaryColumn({ type: 'varchar', length: 150 })
  template_id: string;

  @Column({ type: 'varchar', length: 50 })
  zone_name: string;

  @Column({ type: 'varchar', length: 50 })
  stone_shape: string;

  @Column({ type: 'decimal', precision: 20, scale: 10 })
  dim_l: number;

  @Column({ type: 'decimal', precision: 20, scale: 10 })
  dim_w: number;

  @Column({ type: 'decimal', precision: 20, scale: 10 })
  dim_h: number;

  @Column({ type: 'varchar', length: 62 })
  dim_string: string;

  // @Column({ type: 'int' })
  // base_qty: number;

  @Column({ type: 'decimal', precision: 10, scale: 5, nullable: true })
  base_qty: number | null;

  @Column({ type: 'decimal', precision: 20, scale: 10 })
  weight_each_ct: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  placement: string | null;

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
