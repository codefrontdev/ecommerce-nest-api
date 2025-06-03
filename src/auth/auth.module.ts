import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/@core/shared/email.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DeviceHistoryModule } from 'src/deviceHistory/deviceHistory.module';
import { RabbitMQService } from 'src/@core/shared/rabbitmq.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule, DeviceHistoryModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService, EmailService, RabbitMQService],
  exports: [AuthService],
})
export class AuthModule {}
