"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceUtils = void 0;
const ua_parser_js_1 = require("ua-parser-js");
class DeviceUtils {
    static detectDeviceType(req) {
        const parser = new ua_parser_js_1.UAParser(req.headers['user-agent']);
        const result = parser.getResult();
        return result.device.type || 'desktop';
    }
    static detectOperatingSystem(req) {
        const parser = new ua_parser_js_1.UAParser(req.headers['user-agent']);
        return parser.getOS().name || 'Unknown';
    }
    static detectBrowser(req) {
        const parser = new ua_parser_js_1.UAParser(req.headers['user-agent']);
        return parser.getBrowser().name || 'Unknown';
    }
}
exports.DeviceUtils = DeviceUtils;
//# sourceMappingURL=device-utils.js.map