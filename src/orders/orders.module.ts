
import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entites/order.entity';
import { OrderItem } from './entites/order-item.entity';
import { OrdersService } from './orders.service';
import { PaymentDetails } from 'src/payments/entites/payment.entity';
import { Tracking } from 'src/tracking/entites/tracking.entity';
import { PaymentDetailsController } from 'src/payments/payments.controller';
import { PaymentDetailsService } from 'src/payments/payments.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from 'src/auth/auth.module';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, PaymentDetails, Tracking],),
    InvoiceModule,
    AuthModule
  ],
  controllers: [ OrdersController],
  providers: [OrdersService, PaymentDetailsService],
  exports: [OrdersService, PaymentDetailsService],
})
export class OrdersModule {}
