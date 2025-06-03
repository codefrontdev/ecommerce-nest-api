import { Order } from 'src/orders/entites/order.entity';
export declare class PaymentDetails {
    id: string;
    paymentMethod: string;
    cardHolderName: string;
    cardNumber: string;
    order: Order;
    createdAt: Date;
}
