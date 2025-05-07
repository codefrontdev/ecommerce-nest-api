
import { Order } from 'src/orders/entites/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

type TrackingStep = {
  status: string;
  description: string;
  date: string; // ISO format
  time: string;
};

@Entity('tracking')
export class Tracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  trackingNumber: string;

  @OneToOne(() => Order, (order) => order.tracking, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @Column({ type: 'jsonb' , default:[]})
  steps: TrackingStep[];

  @CreateDateColumn()
  createdAt: Date;
}
