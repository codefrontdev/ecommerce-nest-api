"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const device_history_service_1 = require("./device-history.service");
const device_history_controller_1 = require("./device-history.controller");
const device_history_entity_1 = require("./entities/device-history.entity");
const auth_module_1 = require("../auth/auth.module");
let DeviceHistoryModule = class DeviceHistoryModule {
};
exports.DeviceHistoryModule = DeviceHistoryModule;
exports.DeviceHistoryModule = DeviceHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([device_history_entity_1.DeviceHistory]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        providers: [device_history_service_1.DeviceHistoryService],
        controllers: [device_history_controller_1.DeviceHistoryController],
        exports: [device_history_service_1.DeviceHistoryService, typeorm_1.TypeOrmModule],
    })
], DeviceHistoryModule);
//# sourceMappingURL=deviceHistory.module.js.map