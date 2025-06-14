// src/wishlist/wishlist.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JWTPayloadType } from 'src/utils/types';

@Controller('wishlist')
@UseGuards(JwtAuthGuard) // تأكد أن المستخدم مسجل دخول
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  addToWishlist(
    @CurrentUser() payload: JWTPayloadType,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistService.addToWishlist(payload, createWishlistDto);
  }

  @Get()
  getUserWishlist(@CurrentUser() payload: JWTPayloadType) {
    return this.wishlistService.findUserWishlist(payload);
  }

  @Delete(':id')
  removeFromWishlist(
    @CurrentUser() payload: JWTPayloadType,
    @Param('id') id: string,
  ) {
    return this.wishlistService.removeFromWishlist(payload, id);
  }
}
