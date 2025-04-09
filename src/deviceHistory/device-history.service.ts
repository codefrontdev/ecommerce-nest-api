import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entites/user.entity';
import { DeviceHistory } from './entites/device-history.entity';
import { GetByIdDto } from 'src/products/dto/get-by-id.dto';

@Injectable()
export class DeviceHistoryService {
  constructor(
    @InjectRepository(DeviceHistory)
    private readonly deviceHistoryRepository: Repository<DeviceHistory>,
  ) {}

  
  async createDeviceHistory(
    user: User,
    ipAddress: string,
    userAgent: string,
    deviceType: string,
    os: string,
    browser: string,
    location: string,
  ) {
    const deviceHistory = this.deviceHistoryRepository.create({
      user,
      ipAddress,
      userAgent,
      deviceType,
      os,
      browser,
      location,
      loginAt: new Date(),
    });

    return await this.deviceHistoryRepository.save(deviceHistory);
  }

  
  async getDeviceHistoryByUserId({id}: GetByIdDto) {
    return this.deviceHistoryRepository.find({
      where: { user: { id } },
      order: { loginAt: 'DESC' },
    });
  }
}
