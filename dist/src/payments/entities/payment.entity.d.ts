import { Order } from 'src/orders/entities/order.entity';
export declare class PaymentDetails {
    id: string;
    paymentMethod: string;
    cardHolderName: string;
    cardNumber: string;
    order: Order;
    createdAt: Date;
}
