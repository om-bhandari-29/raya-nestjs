import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MetalPurity } from './metal-purity.entity';

@Entity('metal_master')
export class MetalColor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, type: 'varchar' })
  name: string;

  @OneToMany(() => MetalPurity, (metalPurity) => metalPurity.metal)
  purities: MetalPurity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}

