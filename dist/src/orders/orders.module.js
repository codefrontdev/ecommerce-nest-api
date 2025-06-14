"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const orders_service_1 = require("./services/orders.service");
const payment_entity_1 = require("../payments/entities/payment.entity");
const tracking_entity_1 = require("../tracking/entities/tracking.entity");
const payments_service_1 = require("../payments/payments.service");
const orders_controller_1 = require("./orders.controller");
const auth_module_1 = require("../auth/auth.module");
const invoice_module_1 = require("../invoice/invoice.module");
const user_entity_1 = require("../users/entities/user.entity");
const paypal_service_1 = require("./services/paypal.service");
const products_module_1 = require("../products/products.module");
const order_helper_service_1 = require("./services/order-helper.service");
const users_module_1 = require("../users/users.module");
const coupons_module_1 = require("../coupons/coupons.module");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                order_entity_1.Order,
                order_item_entity_1.OrderItem,
                payment_entity_1.PaymentDetails,
                tracking_entity_1.Tracking,
                user_entity_1.User,
            ]),
            invoice_module_1.InvoiceModule,
            products_module_1.ProductsModule,
            coupons_module_1.CouponModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [
            orders_service_1.OrdersService,
            payments_service_1.PaymentDetailsService,
            paypal_service_1.PayPalService,
            order_helper_service_1.OrderHelperService,
        ],
        exports: [orders_service_1.OrdersService, payments_service_1.PaymentDetailsService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map