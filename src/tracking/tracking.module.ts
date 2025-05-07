import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { Order } from 'src/orders/entites/order.entity';
import { Tracking } from './entites/tracking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tracking, Order])],
  providers: [TrackingService],
  controllers: [TrackingController],
})
export class TrackingModule {}
