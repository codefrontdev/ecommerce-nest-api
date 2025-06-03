import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { PaymentDetails } from './entities/payment.entity';
import { PaymentDetailsService } from './payments.service';
import { PaymentDetailsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentDetails, Order])],
  providers: [PaymentDetailsService],
  controllers: [PaymentDetailsController],
  exports: [PaymentDetailsService],
})
export class PaymentModule {}
