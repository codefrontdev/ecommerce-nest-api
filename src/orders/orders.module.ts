import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrdersService } from './services/orders.service';
import { PaymentDetails } from 'src/payments/entities/payment.entity';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { PaymentDetailsService } from 'src/payments/payments.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from 'src/auth/auth.module';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { User } from 'src/users/entities/user.entity';
import { PayPalService } from './services/paypal.service';
import { ProductsModule } from 'src/products/products.module';
import { OrderHelperService } from './services/order-helper.service';
import { UsersModule } from 'src/users/users.module';
import { CouponModule } from 'src/coupons/coupons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      PaymentDetails,
      Tracking,
      User,
    ]),
    InvoiceModule,
    ProductsModule,
    CouponModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PaymentDetailsService,
    PayPalService,
    OrderHelperService,
  ],
  exports: [OrdersService, PaymentDetailsService],
})
export class OrdersModule {}
