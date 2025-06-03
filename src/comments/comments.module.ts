import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { Comment } from './entites/comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { OrdersModule } from 'src/orders/orders.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    JwtModule,
    AuthModule,
    OrdersModule,
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, JwtAuthGuard, CloudinaryService],
  exports: [CommentsService, TypeOrmModule],
})
export class CommentsModule {}
