declare class CommentDto {
    title: string;
    body: string;
    images?: string[];
}
export declare class CreateReviewDto {
    rating: number;
    comment: CommentDto;
    productId: string;
    userId: string;
}
export {};
