import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entites/user.entity';

@Entity()
export class DeviceHistory {
  @PrimaryGeneratedColumn()
  id: number;

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
