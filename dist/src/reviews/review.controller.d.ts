import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(createReviewDto: CreateReviewDto): Promise<import("./entities/review.entity").Review>;
    findByProduct(productId: string): Promise<import("./entities/review.entity").Review[]>;
    remove(id: string): Promise<void>;
}
