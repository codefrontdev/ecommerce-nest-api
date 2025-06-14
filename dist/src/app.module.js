"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./shared/database.module");
const rabbitmq_module_1 = require("./shared/rabbitmq.module");
const redis_module_1 = require("./shared/redis.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const email_service_1 = require("./shared/email.service");
const products_module_1 = require("./products/products.module");
const cloudinary_service_1 = require("./shared/cloudinary.service");
const app_controller_1 = require("./app.controller");
const categories_module_1 = require("./categories/categories.module");
const brands_module_1 = require("./brands/brands.module");
const analytics_module_1 = require("./analytics/analytics.module");
const orders_module_1 = require("./orders/orders.module");
const schedule_1 = require("@nestjs/schedule");
const comments_module_1 = require("./comments/comments.module");
const invoice_module_1 = require("./invoice/invoice.module");
const coupons_module_1 = require("./coupons/coupons.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const review_module_1 = require("./reviews/review.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                    signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            database_module_1.DatabaseModule,
            redis_module_1.RedisModule,
            brands_module_1.BrandsModule,
            rabbitmq_module_1.RabbitMQModule,
            users_module_1.UsersModule,
            comments_module_1.CommentsModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            analytics_module_1.AnalyticsModule,
            orders_module_1.OrdersModule,
            auth_module_1.AuthModule,
            coupons_module_1.CouponModule,
            invoice_module_1.InvoiceModule,
            wishlist_module_1.WishlistModule,
            review_module_1.ReviewModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [email_service_1.EmailService, jwt_1.JwtService, cloudinary_service_1.CloudinaryService],
        exports: [email_service_1.EmailService, jwt_1.JwtService, cloudinary_service_1.CloudinaryService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map