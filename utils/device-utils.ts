import { UAParser } from 'ua-parser-js';
import { Request } from 'express';

export class DeviceUtils {
  static detectDeviceType(req: Request): string {
    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();
    return result.device.type || 'desktop'; // أو 'mobile' أو 'tablet'
  }

  static detectOperatingSystem(req: Request): string {
    const parser = new UAParser(req.headers['user-agent']);
    return parser.getOS().name || 'Unknown';
  }

  static detectBrowser(req: Request): string {
    const parser = new UAParser(req.headers['user-agent']);
    return parser.getBrowser().name || 'Unknown';
  }

}
