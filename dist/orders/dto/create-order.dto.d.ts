import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto';
import { CreateOrderItemDto } from './create-item.dto';
export declare class CreateOrderDto {
    total: number;
    amount: number;
    paymentMethod: string;
    items: CreateOrderItemDto[];
    paymentDetails: CreatePaymentDto;
}
