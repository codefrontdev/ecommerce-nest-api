import { Order } from 'src/orders/entites/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('payment')
export class PaymentDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paymentMethod: string;

  @Column()
  cardHolderName: string;

  @Column()
  cardNumber: string; 

  @OneToOne(() => Order, (order) => order.paymentDetails)
  @JoinColumn()
  order: Order;

  @CreateDateColumn()
  createdAt: Date;
}
