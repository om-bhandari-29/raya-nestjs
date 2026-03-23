import { GenderEnum } from 'src/core/enum/gender.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, type: 'varchar', nullable: true })
  name: string;

  @Column({ length: 100, type: 'varchar', unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: GenderEnum;

  @Column({ length: 100, type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'numeric', unique: true, nullable: true })
  mobile_number: number;

  @Column({ type: 'varchar', nullable: true })
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otp_expires_at: Date;

  @Column({ type: 'varchar', nullable: true })
  google_id: string;

  @Column({ type: 'varchar', nullable: true })
  facebook_id: string;

  @Column({ type: 'varchar', nullable: true })
  provider: string; // 'mobile', 'google', 'facebook', 'email'

  @Column({ type: 'varchar', nullable: true })
  refresh_token: string;
}
