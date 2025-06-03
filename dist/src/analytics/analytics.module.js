"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const analytics_service_1 = require("./analytics.service");
const analytics_entity_1 = require("./entities/analytics.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const product_entity_1 = require("../products/entities/product.entity");
const analytics_cron_1 = require("./analytics.cron");
const deviceHistory_module_1 = require("../deviceHistory/deviceHistory.module");
const products_module_1 = require("../products/products.module");
const orders_module_1 = require("../orders/orders.module");
const device_history_entity_1 = require("../deviceHistory/entities/device-history.entity");
const analytics_controller_1 = require("./analytics.controller");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([analytics_entity_1.Analytics, order_entity_1.Order, product_entity_1.Product, device_history_entity_1.DeviceHistory]),
            deviceHistory_module_1.DeviceHistoryModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
        ],
        providers: [analytics_service_1.AnalyticsService, analytics_cron_1.AnalyticsCron],
        controllers: [analytics_controller_1.AnalyticsController],
    })
], AnalyticsModule);
//# sourceMappingURL=analytics.module.js.map