import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponService } from './coupons.service';
export declare class CouponController {
    private readonly couponService;
    constructor(couponService: CouponService);
    create(createCouponDto: CreateCouponDto): Promise<import("./entities/coupons.entity").Coupon>;
    findAll(): Promise<import("./entities/coupons.entity").Coupon[]>;
    findOne(id: number): Promise<import("./entities/coupons.entity").Coupon>;
    update(id: number, updateCouponDto: UpdateCouponDto): Promise<import("./entities/coupons.entity").Coupon>;
    remove(id: number): Promise<void>;
    validate(couponCode: string): Promise<{
        message: string;
        success: boolean;
        data: import("./entities/coupons.entity").Coupon;
    }>;
}
