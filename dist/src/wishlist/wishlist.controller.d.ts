import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JWTPayloadType } from 'src/utils/types';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    addToWishlist(payload: JWTPayloadType, createWishlistDto: CreateWishlistDto): Promise<{
        message: string;
        data?: undefined;
    } | {
        message: string;
        data: import("./entities/wishlist.entity").Wishlist;
    }>;
    getUserWishlist(payload: JWTPayloadType): Promise<import("./entities/wishlist.entity").Wishlist[]>;
    removeFromWishlist(payload: JWTPayloadType, id: string): Promise<{
        message: string;
    }>;
}
