import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceHistoryService } from './device-history.service';
import { DeviceHistoryController } from './device-history.controller';
import { DeviceHistory } from './entities/device-history.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceHistory]),
    forwardRef(() => AuthModule),
  ],
  providers: [DeviceHistoryService],
  controllers: [DeviceHistoryController],
  exports: [DeviceHistoryService, TypeOrmModule],
})
export class DeviceHistoryModule {}
