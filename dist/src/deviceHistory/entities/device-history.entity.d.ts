import { User } from 'src/users/entities/user.entity';
export declare class DeviceHistory {
    id: string;
    user: User;
    ipAddress: string;
    userAgent: string;
    deviceType: string;
    os: string;
    browser: string;
    location: string;
    loginAt: Date;
}
