import { User } from 'src/users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Comment } from 'src/comments/entites/comment.entity';
import { PaymentDetails } from 'src/payments/entities/payment.entity';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELED = "canceled",
    DAMAGED = "damaged",
    RETURNED = "returned",
    ABORTED = "aborted",
    PROGRESS = "progress"
}
export declare class Order {
    id: string;
    total: number;
    amount: number;
    discount: number;
    shippingCharge: number;
    estimatedTax: number;
    comments: Comment[];
    paymentMethod: string;
    createdAt: Date;
    user: User;
    tracking: Tracking[];
    paymentDetails: PaymentDetails;
    status: OrderStatus;
    invoice: Invoice;
    items: OrderItem[];
}
