"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const orders_service_1 = require("../orders/orders.service");
const users_service_1 = require("../users/users.service");
const comment_entity_1 = require("./entites/comment.entity");
let CommentsService = class CommentsService {
    commentRepository;
    ordersService;
    usersService;
    constructor(commentRepository, ordersService, usersService) {
        this.commentRepository = commentRepository;
        this.ordersService = ordersService;
        this.usersService = usersService;
    }
    async create(createCommentDto) {
        const { orderId, userId, text } = createCommentDto;
        const { data: order } = await this.ordersService.findOne(orderId);
        const user = await this.usersService.findOne(userId);
        const comment = new comment_entity_1.Comment();
        comment.text = text;
        comment.order = order;
        comment.user = user;
        const savedComment = await this.commentRepository.save(comment);
        return {
            message: 'Comment created successfully',
            success: true,
            data: savedComment,
        };
    }
    async findAll(filter) {
        const { orderId, userId, page = 1, pageSize = 10 } = filter;
        const whereConditions = {};
        if (orderId) {
            whereConditions.order = orderId;
        }
        if (userId) {
            whereConditions.user = userId;
        }
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
    async findOne(id) {
        const comment = await this.commentRepository.findOne({ where: { id } });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        return comment;
    }
    async update(id, updateCommentDto) {
        const comment = await this.findOne(id);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        await this.commentRepository.update(id, updateCommentDto);
        return this.findOne(id);
    }
    async remove(id) {
        const comment = await this.findOne(id);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        await this.commentRepository.delete(id);
        return {
            message: 'Comment deleted successfully',
            success: true,
        };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        orders_service_1.OrdersService,
        users_service_1.UsersService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map