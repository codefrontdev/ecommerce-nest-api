import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto';
import { CreateOrderItemDto } from './create-item.dto';
export declare class CreateOrderDto {
    paymentMethod: string;
    couponCode?: string;
    items: CreateOrderItemDto[];
    paymentDetails: CreatePaymentDto;
    firstName: string;
    lastName: string;
    companyName?: string;
    country: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    deliveryAddress: string;
}
