
import { UserRole, UserStatus } from 'src/@core/utils/enums';
import { Comment } from 'src/comments/entites/comment.entity';
import { DeviceHistory } from 'src/deviceHistory/entities/device-history.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
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
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: [
      UserRole.ADMIN,
      UserRole.CUSTOMER,
      UserRole.SUPER_ADMIN,
      UserRole.CONTENT_ADMIN,
    ],
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  about: string;

  @Column({ nullable: true })
  address: string;

  @Column('simple-json', { default: { url: '', publicId: null } })
  profilePicture: {
    publicId: string;
    url: string;
  };

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

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
