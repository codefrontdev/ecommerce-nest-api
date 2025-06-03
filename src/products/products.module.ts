import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AppModule } from 'src/app.module';
import { CloudinaryService } from 'src/@core/shared/cloudinary.service';
import { Review } from 'src/reviews/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Review]), JwtModule, AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, JwtAuthGuard, CloudinaryService],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
