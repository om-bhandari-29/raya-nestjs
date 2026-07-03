import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('metal_purities')
export class MetalPurity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, type: 'varchar' })
  name: string;

  @Column({ length: 20, type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
