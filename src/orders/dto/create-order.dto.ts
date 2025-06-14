// src/orders/dto/create-order.dto.ts
import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderItem } from '../entities/order-item.entity';
import { Transform, Type } from 'class-transformer';
import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto';
import { CreateOrderItemDto } from './create-item.dto';

class ShippingDto {
  @IsNotEmpty() firstName: string;
  @IsNotEmpty() lastName: string;
  companyName?: string;
  @IsNotEmpty() country: string;
  @IsNotEmpty() streetAddress: string;
  @IsNotEmpty() city: string;
  @IsNotEmpty() state: string;
  @IsNotEmpty() zip: string;
  @IsNotEmpty() phone: string;
  @IsNotEmpty() email: string;
  @IsNotEmpty() deliveryAddress: string; // "Same as billing address" أو "Different address"
}

export class CreateOrderDto {
  @IsNotEmpty()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ValidateNested()
  @Type(() => CreatePaymentDto)
  @IsOptional()
  paymentDetails: CreatePaymentDto;

  @IsNotEmpty() firstName: string;
  @IsNotEmpty() lastName: string;
  companyName?: string;
  @IsNotEmpty() country: string;
  @IsNotEmpty() streetAddress: string;
  @IsNotEmpty() city: string;
  @IsNotEmpty() state: string;
  @IsNotEmpty() zip: string;
  @IsNotEmpty() phone: string;
  @IsNotEmpty() email: string;
  @IsNotEmpty() deliveryAddress: string;
}
