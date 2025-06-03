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
exports.categoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entites/category.entity");
let categoriesService = class categoriesService {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async create(createCategoryDto) {
        return this.categoryRepository.save(createCategoryDto);
    }
    async findAll(filter) {
        const { status, search, page = 1, pageSize = 10, } = filter;
        const whereConditions = {};
        if (status && status !== 'All') {
            whereConditions.status = status;
        }
        if (search) {
            whereConditions.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        const [categories, total] = await this.categoryRepository.findAndCount({
            where: whereConditions,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const groupedCounts = await this.categoryRepository
            .createQueryBuilder('Category')
            .select('Category.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where(whereConditions)
            .groupBy('Category.status')
            .getRawMany();
        const countsMap = {};
        groupedCounts.forEach((row) => {
            countsMap[row.status] = parseInt(row.count);
        });
        return {
            message: 'categories found successfully',
            success: true,
            categories,
            total,
            page,
            lastPage: Math.ceil(total / pageSize),
            currentPage: page,
            nextPage: page < Math.ceil(total / pageSize) ? page + 1 : null,
            pageSize,
            categoriestatusCounts: {
                available: countsMap['active'] || 0,
                disabled: countsMap['inactive'] || 0,
            },
        };
    }
    async findOne(id) {
        const Category = await this.categoryRepository.findOneBy({ id });
        if (!Category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return {
            message: 'Category found successfully',
            success: true,
            data: Category,
        };
    }
    update({ id }, updateCategoryDto) {
        return this.categoryRepository.update(id, updateCategoryDto);
    }
    async remove(id) {
        const category = await this.findOne(id);
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const deleted = await this.categoryRepository.delete(id);
        if (deleted.affected !== 1) {
            throw new common_1.BadRequestException('Category not Deleted');
        }
        return {
            message: 'Category deleted successfully',
            success: true,
        };
    }
};
exports.categoriesService = categoriesService;
exports.categoriesService = categoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], categoriesService);
//# sourceMappingURL=categories.service.js.map