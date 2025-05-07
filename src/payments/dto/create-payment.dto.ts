import { IsNotEmpty, IsString, IsCreditCard } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsNotEmpty()
  @IsString()
  cardHolderName: string;

  @IsNotEmpty()
  @IsCreditCard()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;
}
