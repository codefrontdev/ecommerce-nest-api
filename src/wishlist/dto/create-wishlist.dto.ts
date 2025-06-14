// src/wishlist/dto/create-wishlist.dto.ts
import { IsUUID } from 'class-validator';

export class CreateWishlistDto {
  @IsUUID()
  productId: string;
}
