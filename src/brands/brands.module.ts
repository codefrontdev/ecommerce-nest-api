import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { Brand } from './entites/brand.entity';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { CloudinaryService } from 'src/@core/shared/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand]), JwtModule, AuthModule],
  controllers: [BrandsController],
  providers: [BrandsService, JwtAuthGuard, CloudinaryService],
  exports: [BrandsService],
})
export class BrandsModule {}
