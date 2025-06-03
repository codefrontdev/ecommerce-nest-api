import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewService {
    private readonly reviewRepository;
    constructor(reviewRepository: Repository<Review>);
    create(createReviewDto: CreateReviewDto): Promise<Review>;
    findAll(): Promise<Review[]>;
    findByUser(userId: string): Promise<Review[]>;
    updateReiew(id: string, updateReviewDto: CreateReviewDto): Promise<Review>;
    findByProduct(productId: string): Promise<Review[]>;
    remove(id: string): Promise<void>;
}
