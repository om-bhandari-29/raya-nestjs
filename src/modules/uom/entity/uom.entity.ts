import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('uom')
export class Uom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'boolean', default: false })
  must_be_whole_number: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
