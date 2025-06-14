import { Request } from 'express';
export declare class DeviceUtils {
    static detectDeviceType(req: Request): string;
    static detectOperatingSystem(req: Request): string;
    static detectBrowser(req: Request): string;
}
