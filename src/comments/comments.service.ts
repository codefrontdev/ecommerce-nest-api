import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';
import { Comment } from './entites/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  
  async create(createCommentDto: CreateCommentDto): Promise<{ message: string; success: boolean; data: Comment }> {
    const { orderId, userId, text } = createCommentDto;

    const { data: order } = await this.ordersService.findOne(orderId);
    const user = await this.usersService.findOne(userId);


    const comment = new Comment();
    comment.text = text;
    comment.order = order;
    comment.user = user;

    const savedComment = await this.commentRepository.save(comment);

    return {
      message: 'Comment created successfully',
      success: true,
      data: savedComment,
    }
  }

  
  async findAll(filter: {
    orderId?: string;
    userId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { orderId, userId, page = 1, pageSize = 10 } = filter;

    // شروط البحث
    const whereConditions: any = {};
    if (orderId) {
      whereConditions.order = orderId;
    }

    if (userId) {
      whereConditions.user = userId;
    }

    // جلب التعليقات مع الفلاتر
    const [comments, total] = await this.commentRepository.findAndCount({
      where: whereConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      message: 'Comments fetched successfully',
      success: true,
      comments,
      total,
      page,
      lastPage: Math.ceil(total / pageSize),
      currentPage: page,
      nextPage: page < Math.ceil(total / pageSize) ? page + 1 : null,
      pageSize,
    };
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  
  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    
    await this.commentRepository.update(id, updateCommentDto);
    return this.findOne(id);
  }

  
  async remove(id: string): Promise<{ message: string; success: boolean }> {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // حذف التعليق
    await this.commentRepository.delete(id);
    return {
      message: 'Comment deleted successfully',
      success: true,
    };
  }
}
