import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrackingDto {
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  trackingNumber: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;
}
