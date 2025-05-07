import { Order } from 'src/orders/entites/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, (order) => order.invoice, { onDelete: 'CASCADE' })
  order: Order;

  @Column({ nullable: true })
  invoicePDF: string;


  @Column()
  invoiceNumber: string;

  @Column()
  issuedAt: Date;

  @Column()
  dueAt: Date;

  @Column({ type: 'text', nullable: true })
  QRCode: string;
}
