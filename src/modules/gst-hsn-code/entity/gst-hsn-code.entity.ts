import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('gst_hsn_code')
export class GstHsnCode {
  @PrimaryColumn({ length: 20, type: 'varchar' })
  name: string;

  @Column({ length: 20, type: 'varchar', unique: true })
  hsn_code: string;

  @Column({ type: 'text' })
  description: string;

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
