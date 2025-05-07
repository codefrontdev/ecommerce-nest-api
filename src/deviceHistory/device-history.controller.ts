import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { User } from 'src/users/entites/user.entity';
import { DeviceHistoryService } from './device-history.service';
import { GetByIdDto } from 'src/products/dto/get-by-id.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JWTPayloadType } from 'src/@core/utils/types';
import { Roles } from 'src/auth/decorators/user-role.decorator';
import { UserRole } from 'src/@core/utils/enums';

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

  

  @Delete(':deviceId')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async logoutFromDevice(
    @Param('deviceId') deviceId: string,
    @CurrentUser() JWTpayload: JWTPayloadType,
  ) {
    
    const userId = JWTpayload.id;
    console.log('userId', userId);
    return this.deviceHistoryService.logoutFromDevice(deviceId, JWTpayload);
  }
}
