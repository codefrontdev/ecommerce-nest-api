// src/orders/dto/create-order.dto.ts
import { IsArray, IsDecimal, IsNotEmpty } from 'class-validator';
import { OrderItem } from '../entites/order-item.entity';
import { Transform } from 'class-transformer';
import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto';
import { CreateOrderItemDto } from './create-item.dto';

export class CreateOrderDto {
  // @IsDecimal()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return parseFloat(value);
  })
  total: number;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return parseFloat(value);
  })
  amount: number;

  @IsNotEmpty()
  paymentMethod: string;

  @IsArray()
  @IsNotEmpty()
  items: CreateOrderItemDto[];

  paymentDetails: CreatePaymentDto
}
