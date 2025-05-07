import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { Review } from 'src/reviews/entites/review.entity';
import { Category } from './entites/category.entity';
import { categoriesController } from './categories.controller';
import { categoriesService } from './categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Review]), JwtModule, AuthModule],
  controllers: [categoriesController],
  providers: [categoriesService, JwtAuthGuard],
  exports: [categoriesService],
})
export class CategoriesModule {}
