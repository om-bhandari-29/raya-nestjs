import { GenderEnum } from 'src/core/enum/gender.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, type: 'varchar' })
  name: string;

  @Column({ length: 100, type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 10 })
  gender: GenderEnum;

  @Column({ length: 100, type: 'varchar' })
  password: string;

  @Column({ type: 'numeric' })
  mobile_number: number;

  @Column({ type: 'varchar' })
  otp: string;
}
