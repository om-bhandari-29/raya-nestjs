import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gst_hsn_code')
export class GstHsnCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, type: 'varchar', unique: true })
  hsn_code: string;

  @Column({ length: 255, type: 'varchar' })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  gst_rate: number;

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
