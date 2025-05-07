import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { Analytics } from './entities/analytics.entity';
import { Order } from 'src/orders/entites/order.entity';
import { Product } from 'src/products/entites/product.entity';
import { AnalyticsCron } from './analytics.cron';
import { DeviceHistoryModule } from 'src/deviceHistory/deviceHistory.module';
import { ProductsModule } from 'src/products/products.module';
import { OrdersModule } from 'src/orders/orders.module';
import { DeviceHistory } from 'src/deviceHistory/entites/device-history.entity';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Analytics, Order, Product, DeviceHistory]),
    DeviceHistoryModule,
        ProductsModule,
    OrdersModule,
  ],
    providers: [AnalyticsService, AnalyticsCron],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
