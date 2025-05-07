// src/orders/entities/order.entity.ts
import { User } from 'src/users/entites/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Comment } from 'src/comments/entites/comment.entity';
import { PaymentDetails } from 'src/payments/entites/payment.entity';
import { Tracking } from 'src/tracking/entites/tracking.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  DAMAGED = 'damaged',
  RETURNED = 'returned',
  ABORTED = 'aborted',
  PROGRESS = 'progress',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number; // إضافة حقل الخصم

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCharge: number; // إضافة حقل رسوم الشحن

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedTax: number; // إضافة حقل الضريبة المقدرة

  @OneToMany(() => Comment, (comment) => comment.order)
  comments: Comment[];

  @Column()
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToOne(() => Tracking, (tracking) => tracking.order)
  tracking: Tracking[];

  @OneToOne(() => PaymentDetails, (paymentDetails) => paymentDetails.order, {
    cascade: true,
  })
  paymentDetails: PaymentDetails;

  @Column({
    default: OrderStatus.PENDING,
    enum: OrderStatus,
  })
  status: OrderStatus;

  @OneToOne(() => Invoice, (invoice) => invoice.order, { cascade: true })
  @JoinColumn()
  invoice: Invoice;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
