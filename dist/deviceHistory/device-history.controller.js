"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceHistoryController = void 0;
const common_1 = require("@nestjs/common");
const device_history_service_1 = require("./device-history.service");
const get_by_id_dto_1 = require("../products/dto/get-by-id.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_role_decorator_1 = require("../auth/decorators/user-role.decorator");
const enums_1 = require("../@core/utils/enums");
let DeviceHistoryController = class DeviceHistoryController {
    deviceHistoryService;
    constructor(deviceHistoryService) {
        this.deviceHistoryService = deviceHistoryService;
    }
    async getDeviceHistory(userId) {
        const deviceHistory = await this.deviceHistoryService.getDeviceHistoryByUserId(userId);
        return { success: true, data: deviceHistory };
    }
    async createDeviceHistory(deviceHistoryData) {
        const { user, ipAddress, userAgent, deviceType, os, browser, location } = deviceHistoryData;
        const newDeviceHistory = await this.deviceHistoryService.createDeviceHistory(user, ipAddress, userAgent, deviceType, os, browser, location);
        return { success: true, data: newDeviceHistory };
    }
    async logoutFromDevice(deviceId, JWTpayload) {
        const userId = JWTpayload.id;
        console.log('userId', userId);
        return this.deviceHistoryService.logoutFromDevice(deviceId, JWTpayload);
    }
};
exports.DeviceHistoryController = DeviceHistoryController;
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_by_id_dto_1.GetByIdDto]),
    __metadata("design:returntype", Promise)
], DeviceHistoryController.prototype, "getDeviceHistory", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeviceHistoryController.prototype, "createDeviceHistory", null);
__decorate([
    (0, common_1.Delete)(':deviceId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('deviceId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeviceHistoryController.prototype, "logoutFromDevice", null);
exports.DeviceHistoryController = DeviceHistoryController = __decorate([
    (0, common_1.Controller)('device-history'),
    __metadata("design:paramtypes", [device_history_service_1.DeviceHistoryService])
], DeviceHistoryController);
//# sourceMappingURL=device-history.controller.js.map