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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const review_entity_1 = require("./entities/review.entity");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
let ReviewService = class ReviewService {
    reviewRepository;
    usersService;
    constructor(reviewRepository, usersService) {
        this.reviewRepository = reviewRepository;
        this.usersService = usersService;
    }
    async create(createReviewDto) {
        let user = await this.usersService.findOneByEmail(createReviewDto.email);
        if (!createReviewDto.userId && !user) {
            user = await this.usersService.prepareUser({
                firstName: createReviewDto.username.split(' ')[0] || '',
                lastName: createReviewDto.username.split(' ')[1] || '',
                email: createReviewDto.email,
            });
        }
        const review = this.reviewRepository.create({
            ...createReviewDto,
            user: { id: createReviewDto.userId || user.id },
            product: { id: createReviewDto.productId },
        });
        await this.reviewRepository.save(review);
        return {
            message: 'Review created successfully',
            success: true,
            data: review,
        };
    }
    async findAll() {
        const reviews = await this.reviewRepository.find({
            relations: ['user', 'product'],
            order: { createdAt: 'DESC' },
        });
        return {
            message: 'Reviews found successfully',
            success: true,
            data: reviews,
        };
    }
    async findByUser(userId) {
        const reviews = await this.reviewRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'product'],
            order: { createdAt: 'DESC' },
        });
        return {
            message: 'Reviews found successfully',
            success: true,
            data: reviews,
        };
    }
    async updateReiew(id, updateReviewDto) {
        const review = await this.reviewRepository.findOne({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        await this.reviewRepository.update(id, updateReviewDto);
        const updatedReview = await this.reviewRepository.findOne({
            where: { id },
        });
        if (!updatedReview)
            throw new common_1.NotFoundException('Updated review not found');
        return {
            message: 'Review updated successfully',
            success: true,
            data: updatedReview,
        };
    }
    async findByProduct(productId) {
        const reviews = await this.reviewRepository.find({
            where: { product: { id: productId } },
            relations: ['user', 'product'],
            order: { createdAt: 'DESC' },
        });
        return {
            message: 'Reviews found successfully',
            success: true,
            data: reviews,
        };
    }
    async remove(id) {
        const review = await this.reviewRepository.findOne({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        await this.reviewRepository.remove(review);
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], ReviewService);
//# sourceMappingURL=review.service.js.map