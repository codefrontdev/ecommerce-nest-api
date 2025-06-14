declare class CommentDto {
    title: string;
    body: string;
    images?: string[];
}
export declare class CreateReviewDto {
    rating: number;
    comment: CommentDto;
    username: string;
    email: string;
    productId: string;
    userId?: string;
}
export {};
