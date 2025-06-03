import { Repository } from 'typeorm';
import { PaymentDetails } from './entities/payment.entity';
import { Order } from 'src/orders/entities/order.entity';
interface CreatePaymentDto {
    paymentMethod: string;
    cardHolderName: string;
    cardNumber: string;
    orderId: string;
}
export declare class PaymentDetailsService {
    private readonly paymentRepository;
    private readonly orderRepository;
    constructor(paymentRepository: Repository<PaymentDetails>, orderRepository: Repository<Order>);
    create(createPaymentDto: CreatePaymentDto): Promise<PaymentDetails>;
    findByOrderId(orderId: string): Promise<PaymentDetails>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
export {};
