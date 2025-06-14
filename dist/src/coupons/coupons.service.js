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
exports.CouponService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const coupons_entity_1 = require("./entities/coupons.entity");
let CouponService = class CouponService {
    couponRepository;
    constructor(couponRepository) {
        this.couponRepository = couponRepository;
    }
    async create(createCouponDto) {
        const coupon = this.couponRepository.create(createCouponDto);
        return this.couponRepository.save(coupon);
    }
    async findAll() {
        return this.couponRepository.find();
    }
    async findOne(id) {
        const coupon = await this.couponRepository.findOneBy({ id });
        if (!coupon) {
            throw new common_1.NotFoundException(`Coupon with id ${id} not found`);
        }
        return coupon;
    }
    async findByCode(code) {
        const coupon = await this.couponRepository.findOneBy({ code });
        if (!coupon) {
            throw new common_1.NotFoundException(`Coupon with code "${code}" not found`);
        }
        return coupon;
    }
    async update(id, updateCouponDto) {
        const coupon = await this.findOne(id);
        Object.assign(coupon, updateCouponDto);
        return this.couponRepository.save(coupon);
    }
    async remove(id) {
        const coupon = await this.findOne(id);
        await this.couponRepository.remove(coupon);
    }
    async validateCoupon(code) {
        const coupon = await this.findByCode(code);
        if (!coupon.isActive) {
            throw new common_1.BadRequestException('Coupon is not active');
        }
        if (coupon.expiryDate && coupon.expiryDate < new Date()) {
            throw new common_1.BadRequestException('Coupon has expired');
        }
        return {
            message: 'Coupon is valid',
            success: true,
            data: coupon
        };
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coupons_entity_1.Coupon)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CouponService);
//# sourceMappingURL=coupons.service.js.map