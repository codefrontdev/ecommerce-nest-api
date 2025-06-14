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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wishlist_entity_1 = require("./entities/wishlist.entity");
let WishlistService = class WishlistService {
    wishlistRepository;
    constructor(wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }
    async addToWishlist(payload, createWishlistDto) {
        const userId = payload.id;
        const exists = await this.wishlistRepository.findOne({
            where: {
                user: { id: userId },
                product: { id: createWishlistDto.productId },
            },
            relations: ['user', 'product'],
        });
        if (exists) {
            return { message: 'Product is already in wishlist' };
        }
        const wishlistItem = this.wishlistRepository.create({
            user: { id: userId },
            product: { id: createWishlistDto.productId },
        });
        await this.wishlistRepository.save(wishlistItem);
        return { message: 'Added to wishlist successfully', data: wishlistItem };
    }
    async findUserWishlist(payload) {
        const userId = payload.id;
        const wishlist = await this.wishlistRepository.find({
            where: { user: { id: userId } },
            relations: ['product'],
        });
        return wishlist;
    }
    async removeFromWishlist(payload, id) {
        const userId = payload.id;
        const wishlistItem = await this.wishlistRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!wishlistItem) {
            throw new common_1.NotFoundException('Wishlist item not found');
        }
        await this.wishlistRepository.remove(wishlistItem);
        return { message: 'Removed from wishlist successfully' };
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wishlist_entity_1.Wishlist)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map