import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { User } from 'src/users/entites/user.entity';
import { DeviceHistoryService } from './device-history.service';
import { GetByIdDto } from 'src/products/dto/get-by-id.dto';

@Controller('device-history')
export class DeviceHistoryController {
  constructor(private readonly deviceHistoryService: DeviceHistoryService) {}

  
  @Get(':userId')
  async getDeviceHistory(@Param('userId') userId: GetByIdDto) {
    const deviceHistory =
      await this.deviceHistoryService.getDeviceHistoryByUserId(userId);
    return { success: true, data: deviceHistory };
  }

  
  @Post()
  async createDeviceHistory(
    @Body()
    deviceHistoryData: {
      user: User;
      ipAddress: string;
      userAgent: string;
      deviceType: string;
      os: string;
      browser: string;
      location: string;
    },
  ) {
    const { user, ipAddress, userAgent, deviceType, os, browser, location } =
      deviceHistoryData;
    const newDeviceHistory =
      await this.deviceHistoryService.createDeviceHistory(
        user,
        ipAddress,
        userAgent,
        deviceType,
        os,
        browser,
        location,
      );
    return { success: true, data: newDeviceHistory };
  }
}
