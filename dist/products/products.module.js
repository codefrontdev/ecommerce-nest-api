"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entites/product.entity");
const products_controller_1 = require("./products.controller");
const products_service_1 = require("./products.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
const auth_module_1 = require("../auth/auth.module");
const cloudinary_service_1 = require("../@core/shared/cloudinary.service");
const review_entity_1 = require("../reviews/entites/review.entity");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, review_entity_1.Review]), jwt_1.JwtModule, auth_module_1.AuthModule],
        controllers: [products_controller_1.ProductsController],
        providers: [products_service_1.ProductsService, jwt_auth_guard_1.JwtAuthGuard, cloudinary_service_1.CloudinaryService],
        exports: [products_service_1.ProductsService, typeorm_1.TypeOrmModule],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map