// src/wishlist/wishlist.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity'; // كيّان المفضلة
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JWTPayloadType } from 'src/utils/types';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async addToWishlist(
    payload: JWTPayloadType,
    createWishlistDto: CreateWishlistDto,
  ) {
    const userId = payload.id;

    // تحقق إذا العنصر موجود مسبقًا للمستخدم
    const exists = await this.wishlistRepository.findOne({
      where: {
        user: { id: userId }, // شرط عبر علاقة user
        product: { id: createWishlistDto.productId },
      },
      relations: ['user', 'product'], // تأكد من جلب العلاقات اللازمة
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

  async findUserWishlist(payload: JWTPayloadType) {
    const userId = payload.id;

    const wishlist = await this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'], // اجلب بيانات المنتج مع المفضلة إذا متوفرة
    });

    return wishlist;
  }

  async removeFromWishlist(payload: JWTPayloadType, id: string) {
    const userId = payload.id;

    // تحقق أن العنصر ينتمي للمستخدم
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.wishlistRepository.remove(wishlistItem);

    return { message: 'Removed from wishlist successfully' };
  }
}
