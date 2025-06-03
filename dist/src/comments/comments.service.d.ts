import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';
import { Comment } from './entites/comment.entity';
export declare class CommentsService {
    private readonly commentRepository;
    private readonly ordersService;
    private readonly usersService;
    constructor(commentRepository: Repository<Comment>, ordersService: OrdersService, usersService: UsersService);
    create(createCommentDto: CreateCommentDto): Promise<{
        message: string;
        success: boolean;
        data: Comment;
    }>;
    findAll(filter: {
        orderId?: string;
        userId?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        message: string;
        success: boolean;
        comments: Comment[];
        total: number;
        page: number;
        lastPage: number;
        currentPage: number;
        nextPage: number | null;
        pageSize: number;
    }>;
    findOne(id: string): Promise<Comment>;
    update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
