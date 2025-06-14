import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JWTPayloadType } from 'src/utils/types';
export declare class WishlistService {
    private wishlistRepository;
    constructor(wishlistRepository: Repository<Wishlist>);
    addToWishlist(payload: JWTPayloadType, createWishlistDto: CreateWishlistDto): Promise<{
        message: string;
        data?: undefined;
    } | {
        message: string;
        data: Wishlist;
    }>;
    findUserWishlist(payload: JWTPayloadType): Promise<Wishlist[]>;
    removeFromWishlist(payload: JWTPayloadType, id: string): Promise<{
        message: string;
    }>;
}
