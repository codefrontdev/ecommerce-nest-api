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
exports.CouponController = void 0;
const common_1 = require("@nestjs/common");
const create_coupon_dto_1 = require("./dto/create-coupon.dto");
const update_coupon_dto_1 = require("./dto/update-coupon.dto");
const coupons_service_1 = require("./coupons.service");
const user_role_decorator_1 = require("../auth/decorators/user-role.decorator");
const enums_1 = require("../utils/enums");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CouponController = class CouponController {
    couponService;
    constructor(couponService) {
        this.couponService = couponService;
    }
    create(createCouponDto) {
        return this.couponService.create(createCouponDto);
    }
    findAll() {
        return this.couponService.findAll();
    }
    findOne(id) {
        return this.couponService.findOne(id);
    }
    update(id, updateCouponDto) {
        return this.couponService.update(id, updateCouponDto);
    }
    remove(id) {
        return this.couponService.remove(id);
    }
    validate(couponCode) {
        return this.couponService.validateCoupon(couponCode);
    }
};
exports.CouponController = CouponController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_coupon_dto_1.CreateCouponDto]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_coupon_dto_1.UpdateCouponDto]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('validate'),
    __param(0, (0, common_1.Body)('couponCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "validate", null);
exports.CouponController = CouponController = __decorate([
    (0, common_1.Controller)('coupons'),
    __metadata("design:paramtypes", [coupons_service_1.CouponService])
], CouponController);
//# sourceMappingURL=coupons.controller.js.map