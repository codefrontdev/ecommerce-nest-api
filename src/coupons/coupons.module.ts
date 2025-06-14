import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupons.entity';
import { CouponService } from './coupons.service';
import { CouponController } from './coupons.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon]), AuthModule],
  providers: [CouponService, JwtAuthGuard],
  controllers: [CouponController],
  exports: [CouponService],
})
export class CouponModule {}
