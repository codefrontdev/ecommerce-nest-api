import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UsersService } from 'src/users/users.service';
export declare class ReviewService {
    private readonly reviewRepository;
    private readonly usersService;
    constructor(reviewRepository: Repository<Review>, usersService: UsersService);
    create(createReviewDto: CreateReviewDto): Promise<{
        message: string;
        success: boolean;
        data: Review;
    }>;
    findAll(): Promise<{
        message: string;
        success: boolean;
        data: Review[];
    }>;
    findByUser(userId: string): Promise<{
        message: string;
        success: boolean;
        data: Review[];
    }>;
    updateReiew(id: string, updateReviewDto: CreateReviewDto): Promise<{
        message: string;
        success: boolean;
        data: Review;
    }>;
    findByProduct(productId: string): Promise<{
        message: string;
        success: boolean;
        data: Review[];
    }>;
    remove(id: string): Promise<void>;
}
