import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UsersModule } from 'src/users/users.module';



@Module({
  providers: [ReviewService], // ← أضف هنا ReviewService
  imports: [TypeOrmModule.forFeature([Review]), UsersModule],
  exports: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
