import { GetByIdDto } from './dto/get-by-id.dto';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto): Promise<{
        message: string;
        success: boolean;
        data: import("./entites/comment.entity").Comment;
    }>;
    findAll(query: {
        orderId?: string;
        userId?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        message: string;
        success: boolean;
        comments: import("./entites/comment.entity").Comment[];
        total: number;
        page: number;
        lastPage: number;
        currentPage: number;
        nextPage: number | null;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("./entites/comment.entity").Comment>;
    update(id: GetByIdDto, updateCommentDto: UpdateCommentDto): Promise<import("./entites/comment.entity").Comment>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
