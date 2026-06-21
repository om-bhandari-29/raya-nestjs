import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { ProductBlueprint } from './product-blueprint.entity';
import { BlueprintSizeMatrix } from './blueprint-size-matrix.entity';

@Entity('blueprint_zone_slots')
@Unique(['blueprint_id', 'zone_name', 'shape_normalized'])
export class BlueprintZoneSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductBlueprint, (blueprint) => blueprint.zone_slots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blueprint_id' })
  blueprint: ProductBlueprint;

  @Column()
  blueprint_id: number;

  @Column({ type: 'varchar', length: 50 })
  zone_name: string;

  @Column({ type: 'varchar', length: 50 })
  shape_normalized: string;

  @Column({ type: 'numeric', precision: 20, scale: 14, nullable: true })
  dim_l_mm: number | null;

  @Column({ type: 'numeric', precision: 20, scale: 14, nullable: true })
  dim_w_mm: number | null;

  @Column({ type: 'varchar', length: 150 })
  template_id: string;

  @Column({ type: 'boolean' })
  is_dynamic_by_size: boolean;

  @Column({ type: 'int', nullable: true })
  fixed_quantity: number | null;

  @OneToMany(() => BlueprintSizeMatrix, (matrix) => matrix.zone_slot)
  size_matrices: BlueprintSizeMatrix[];
}
