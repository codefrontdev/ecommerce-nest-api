import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { DeviceHistory } from './entities/device-history.entity';
import { GetByIdDto } from 'src/products/dto/get-by-id.dto';
import { JWTPayloadType } from 'src/@core/utils/types';
import { UserRole } from 'src/@core/utils/enums';

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
    // تحقق إذا كان هناك سجل مطابق مسبقًا
    //  const existing = await this.deviceHistoryRepository
    //    .createQueryBuilder('device')
    //    .leftJoin('device.user', 'user')
    //    .where('device.ipAddress = :ipAddress', { ipAddress })
    //    .andWhere('device.userAgent = :userAgent', { userAgent })
    //    .andWhere('device.deviceType = :deviceType', { deviceType })
    //    .andWhere('device.os = :os', { os })
    //    .andWhere('device.browser = :browser', { browser })
    //    .andWhere('user.id = :userId', { userId: user.id })
    //    .getOne();

    //   if (existing) {
    //     return existing;
    //   }

    const deviceHistory = this.deviceHistoryRepository.create({
      user,
      ipAddress,
      userAgent,
      deviceType,
      os,
      browser,
      location,
    });

    const result = await this.deviceHistoryRepository.save(deviceHistory);
    console.log('result', result);
    return result;
  }

  async getDeviceHistoryByUserId({ id }: GetByIdDto) {
    return this.deviceHistoryRepository.find({
      where: { user: { id } },
      order: { loginAt: 'DESC' },
    });
  }

  async logoutFromDevice(deviceId: string, JWTpayload: JWTPayloadType) {
    const userId = JWTpayload.id;
    const currentDeviceId = JWTpayload.deviceId;

    if (deviceId === currentDeviceId) {
      throw new ForbiddenException(
        'You cannot log out from the device you are currently logged in from.',
      );
    }

    const filter = {};
    if (JWTpayload.role === UserRole.ADMIN) {
      filter['id'] = { id: deviceId };
    }
    filter['user'] = { id: userId };
    filter['id'] = deviceId;
    const device = await this.deviceHistoryRepository.findOne({
      where: filter,
    });

    if (!device) {
      throw new NotFoundException('Device not found or unauthorized.');
    }

    const result = await this.deviceHistoryRepository.delete(deviceId);

    if (result.affected === 0) {
      throw new NotFoundException('Device not found or unauthorized.');
    }
    return { message: 'Logged out from device successfully.' };
  }
}
