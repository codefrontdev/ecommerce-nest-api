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
exports.DeviceHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_history_entity_1 = require("./entities/device-history.entity");
const enums_1 = require("../utils/enums");
let DeviceHistoryService = class DeviceHistoryService {
    deviceHistoryRepository;
    constructor(deviceHistoryRepository) {
        this.deviceHistoryRepository = deviceHistoryRepository;
    }
    async createDeviceHistory(user, ipAddress, userAgent, deviceType, os, browser, location) {
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
        return result;
    }
    async getDeviceHistoryByUserId({ id }) {
        return this.deviceHistoryRepository.find({
            where: { user: { id } },
            order: { loginAt: 'DESC' },
        });
    }
    async logoutFromDevice(deviceId, JWTpayload) {
        const userId = JWTpayload.id;
        const currentDeviceId = JWTpayload.deviceId;
        if (deviceId === currentDeviceId) {
            throw new common_1.ForbiddenException('You cannot log out from the device you are currently logged in from.');
        }
        const filter = {};
        if (JWTpayload.role === enums_1.UserRole.ADMIN) {
            filter['id'] = { id: deviceId };
        }
        filter['user'] = { id: userId };
        filter['id'] = deviceId;
        const device = await this.deviceHistoryRepository.findOne({
            where: filter,
        });
        if (!device) {
            throw new common_1.NotFoundException('Device not found or unauthorized.');
        }
        const result = await this.deviceHistoryRepository.delete(deviceId);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Device not found or unauthorized.');
        }
        return { message: 'Logged out from device successfully.' };
    }
};
exports.DeviceHistoryService = DeviceHistoryService;
exports.DeviceHistoryService = DeviceHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_history_entity_1.DeviceHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeviceHistoryService);
//# sourceMappingURL=device-history.service.js.map