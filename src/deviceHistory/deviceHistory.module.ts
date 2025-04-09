import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceHistoryService } from "./device-history.service";
import { DeviceHistoryController } from "./device-history.controller";
import { DeviceHistory } from "./entites/device-history.entity";


@Module({
  imports: [TypeOrmModule.forFeature([DeviceHistory])],
  providers: [DeviceHistoryService],
  controllers: [DeviceHistoryController],
  exports: [DeviceHistoryService],
})
export class DeviceHistoryModule {}