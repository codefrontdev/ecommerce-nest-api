import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { DeviceHistory } from './entities/device-history.entity';
import { GetByIdDto } from 'src/products/dto/get-by-id.dto';
import { JWTPayloadType } from 'src/utils/types';
export declare class DeviceHistoryService {
    private readonly deviceHistoryRepository;
    constructor(deviceHistoryRepository: Repository<DeviceHistory>);
    createDeviceHistory(user: User, ipAddress: string, userAgent: string, deviceType: string, os: string, browser: string, location: string): Promise<DeviceHistory>;
    getDeviceHistoryByUserId({ id }: GetByIdDto): Promise<DeviceHistory[]>;
    logoutFromDevice(deviceId: string, JWTpayload: JWTPayloadType): Promise<{
        message: string;
    }>;
}
