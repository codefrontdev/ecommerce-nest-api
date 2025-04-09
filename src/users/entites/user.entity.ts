import { DeviceHistory } from 'src/deviceHistory/entites/device-history.entity';
import { Review } from 'src/reviews/entites/review.entity';
import { UserRole, UserStatus } from 'src/utils/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: [
      UserRole.ADMIN,
      UserRole.USER,
      UserRole.SUPER_ADMIN,
      UserRole.CONTENT_ADMIN,
    ],
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({
    nullable: true,
    enum: [UserStatus.ACTIVE, UserStatus.INACTIVE],
    default: 'inactive',
  })
  status: UserStatus;

  @Column({ default: 0 })
  failedAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lastFailedAttempt: Date | null;

  @OneToMany(() => DeviceHistory, (deviceHistory) => deviceHistory.user, {
    cascade: true,
  })
  deviceHistory: DeviceHistory[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
