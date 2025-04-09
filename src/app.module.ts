import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './shared/database.module';
import { RabbitMQModule } from './shared/rabbitmq.module';
import { RedisModule } from './shared/redis.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailService } from './shared/email.service';
import { ProductsModule } from './products/products.module';
import { CloudinaryService } from './shared/cloudinary.service';
import { AppController } from './app.controller';

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
    DatabaseModule,
    RedisModule,
    RabbitMQModule,
    UsersModule,
    ProductsModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [EmailService, JwtService, CloudinaryService],
  exports: [EmailService, JwtService, CloudinaryService],
})
export class AppModule {}
