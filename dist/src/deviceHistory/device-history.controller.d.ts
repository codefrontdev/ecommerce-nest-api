import { User } from 'src/users/entities/user.entity';
import { DeviceHistoryService } from './device-history.service';
import { GetByIdDto } from 'src/products/dto/get-by-id.dto';
import { JWTPayloadType } from 'src/utils/types';
export declare class DeviceHistoryController {
    private readonly deviceHistoryService;
    constructor(deviceHistoryService: DeviceHistoryService);
    getDeviceHistory(userId: GetByIdDto): Promise<{
        success: boolean;
        data: import("./entities/device-history.entity").DeviceHistory[];
    }>;
    createDeviceHistory(deviceHistoryData: {
        user: User;
        ipAddress: string;
        userAgent: string;
        deviceType: string;
        os: string;
        browser: string;
        location: string;
    }): Promise<{
        success: boolean;
        data: import("./entities/device-history.entity").DeviceHistory;
    }>;
    logoutFromDevice(deviceId: string, JWTpayload: JWTPayloadType): Promise<{
        message: string;
    }>;
}
