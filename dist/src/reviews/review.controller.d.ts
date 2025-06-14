import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(createReviewDto: CreateReviewDto): Promise<{
        message: string;
        success: boolean;
        data: import("./entities/review.entity").Review;
    }>;
    findByProduct(productId: string): Promise<{
        message: string;
        success: boolean;
        data: import("./entities/review.entity").Review[];
    }>;
    remove(id: string): Promise<void>;
}
