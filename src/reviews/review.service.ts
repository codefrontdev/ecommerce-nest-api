// src/reviews/review.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UsersService } from 'src/users/users.service';
import { UserRole, UserStatus } from 'src/utils/enums';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    private readonly usersService: UsersService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
  ): Promise<{ message: string; success: boolean; data: Review }> {
    console.log('createReviewDto', createReviewDto);
    let user = await this.usersService.findOneByEmail(createReviewDto.email);
    if (!createReviewDto.userId && !user) {
      user = await this.usersService.prepareUser({
        firstName: createReviewDto.username.split(' ')[0] || '',
        lastName: createReviewDto.username.split(' ')[1] || '',
        email: createReviewDto.email,
      });
    }
    const review = this.reviewRepository.create({
      ...createReviewDto,
      user: { id: createReviewDto.userId || user.id },
      product: { id: createReviewDto.productId },
    });

    await this.reviewRepository.save(review);
    return {
      message: 'Review created successfully',
      success: true,
      data: review,
    };
  }

  async findAll(): Promise<{
    message: string;
    success: boolean;
    data: Review[];
  }> {
    const reviews = await this.reviewRepository.find({
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
    return {
      message: 'Reviews found successfully',
      success: true,
      data: reviews,
    };
  }

  async findByUser(
    userId: string,
  ): Promise<{ message: string; success: boolean; data: Review[] }> {
    const reviews = await this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
    return {
      message: 'Reviews found successfully',
      success: true,
      data: reviews,
    };
  }

  async updateReiew(
    id: string,
    updateReviewDto: CreateReviewDto,
  ): Promise<{ message: string; success: boolean; data: Review }> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    await this.reviewRepository.update(id, updateReviewDto);
    const updatedReview = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!updatedReview) throw new NotFoundException('Updated review not found');
    return {
      message: 'Review updated successfully',
      success: true,
      data: updatedReview,
    };
  }

  async findByProduct(
    productId: string,
  ): Promise<{ message: string; success: boolean; data: Review[] }> {
    const reviews = await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
    return {
      message: 'Reviews found successfully',
      success: true,
      data: reviews,
    };
  }

  async remove(id: string): Promise<void> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    await this.reviewRepository.remove(review);
  }
}
