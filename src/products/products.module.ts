import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entites/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AppModule } from 'src/app.module';
import { CloudinaryService } from 'src/shared/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), JwtModule, AuthModule],
  controllers: [ProductsController], 
  providers: [ProductsService, JwtAuthGuard, CloudinaryService],
  exports: [ProductsService],
})
export class ProductsModule {}
