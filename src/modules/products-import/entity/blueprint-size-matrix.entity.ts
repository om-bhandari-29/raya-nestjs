import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { BlueprintZoneSlot } from './blueprint-zone-slot.entity';

@Entity('blueprint_size_matrix')
@Unique(['zone_slot_id', 'ring_size'])
export class BlueprintSizeMatrix {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BlueprintZoneSlot, (slot) => slot.size_matrices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'zone_slot_id' })
  zone_slot: BlueprintZoneSlot;

  @Column()
  zone_slot_id: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  ring_size: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 3,
    nullable: true,
    default: 0.0,
  })
  metal_weight: number;

  @Column({ type: 'int' })
  stone_quantity: number;
}
