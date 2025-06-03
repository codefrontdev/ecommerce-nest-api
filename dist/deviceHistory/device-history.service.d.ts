import { Repository } from 'typeorm';
import { User } from 'src/users/entites/user.entity';
import { DeviceHistory } from './entites/device-history.entity';
import { GetByIdDto } from 'src/products/dto/get-by-id.dto';
import { JWTPayloadType } from 'src/@core/utils/types';
export declare class DeviceHistoryService {
    private readonly deviceHistoryRepository;
    constructor(deviceHistoryRepository: Repository<DeviceHistory>);
    createDeviceHistory(user: User, ipAddress: string, userAgent: string, deviceType: string, os: string, browser: string, location: string): Promise<DeviceHistory>;
    getDeviceHistoryByUserId({ id }: GetByIdDto): Promise<DeviceHistory[]>;
    logoutFromDevice(deviceId: string, JWTpayload: JWTPayloadType): Promise<{
        message: string;
    }>;
}
