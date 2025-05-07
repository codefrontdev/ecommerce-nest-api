import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './@core/shared/database.module';
import { RabbitMQModule } from './@core/shared/rabbitmq.module';
import { RedisModule } from './@core/shared/redis.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailService } from './@core/shared/email.service';
import { ProductsModule } from './products/products.module';
import { CloudinaryService } from './@core/shared/cloudinary.service';
import { AppController } from './app.controller';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { OrdersModule } from './orders/orders.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommentsModule } from './comments/comments.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    RedisModule,
    BrandsModule,
    RabbitMQModule,
    UsersModule,
    CommentsModule,
    ProductsModule,
    CategoriesModule,
    AnalyticsModule,
    OrdersModule,
    AuthModule,
    InvoiceModule,
  ],

  controllers: [AppController],
  providers: [EmailService, JwtService, CloudinaryService],
  exports: [EmailService, JwtService, CloudinaryService],
})
export class AppModule {}
