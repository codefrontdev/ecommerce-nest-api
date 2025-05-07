import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entites/user.entity';

@Entity('device_history')
export class DeviceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.deviceHistory)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column()
  deviceType: string;

  @Column()
  os: string;

  @Column()
  browser: string;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn()
  loginAt: Date;
}
