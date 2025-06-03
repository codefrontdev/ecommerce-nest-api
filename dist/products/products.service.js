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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entites/product.entity");
const typeorm_2 = require("typeorm");
const cloudinary_service_1 = require("../@core/shared/cloudinary.service");
let ProductsService = class ProductsService {
    productRepository;
    cloudinaryService;
    constructor(productRepository, cloudinaryService) {
        this.productRepository = productRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async create(createProductDto) {
        return this.productRepository.save(createProductDto);
    }
    async findAll(filter) {
        const { status, search, page = 1, pageSize = 10, color, category, sort, minPrice, maxPrice, } = filter;
        const whereConditions = {};
        if (status && status !== 'All') {
            whereConditions.status = status;
        }
        if (search) {
            whereConditions.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        if (color) {
            whereConditions.color = color;
        }
        if (category) {
            whereConditions.category = category;
        }
        if (minPrice !== undefined && maxPrice !== undefined) {
            whereConditions.price = (0, typeorm_2.Between)(minPrice, maxPrice);
        }
        else if (minPrice !== undefined) {
            whereConditions.price = (0, typeorm_2.MoreThanOrEqual)(minPrice);
        }
        else if (maxPrice !== undefined) {
            whereConditions.price = (0, typeorm_2.LessThanOrEqual)(maxPrice);
        }
        const [products, total] = await this.productRepository.findAndCount({
            where: whereConditions,
            skip: (page - 1) * pageSize,
            take: pageSize,
            relations: ['category', 'brand', 'reviews'],
        });
        const groupedCounts = await this.productRepository
            .createQueryBuilder('product')
            .select('product.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where(whereConditions)
            .groupBy('product.status')
            .getRawMany();
        const countsMap = {};
        groupedCounts.forEach((row) => {
            countsMap[row.status] = parseInt(row.count);
        });
        console.log(products);
        return {
            message: 'Products found successfully',
            success: true,
            products,
            total,
            totalPages: Math.ceil(total / pageSize),
            lastPage: Math.ceil(total / pageSize),
            currentPage: page,
            nextPage: page < Math.ceil(total / pageSize) ? page + 1 : null,
            pageSize,
            productStatusCounts: {
                available: countsMap['available'] || 0,
                disabled: countsMap['disabled'] || 0,
            },
        };
    }
    async findByStatusCount() {
        const groupedCounts = await this.productRepository
            .createQueryBuilder('product')
            .select('product.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('product.status')
            .getRawMany();
        const countsMap = {};
        groupedCounts.forEach((row) => {
            countsMap[row.status] = parseInt(row.count);
        });
        return {
            available: countsMap['available'] || 0,
            disabled: countsMap['disabled'] || 0,
        };
    }
    async findOne(id) {
        console.log(id);
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'brand', 'reviews'],
        });
        console.log(product);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.status === 'disabled') {
            throw new common_1.BadRequestException('Product is disabled');
        }
        return {
            message: 'Product found successfully',
            success: true,
            data: product,
        };
    }
    async update({ id }, updateProductDto) {
        const product = await this.findOne(id);
        if (product.data.image?.publicId) {
            this.cloudinaryService.deleteImage(product.data.image.publicId, 'products');
        }
        if (product.data.images) {
            product.data.images.forEach((image) => {
                this.cloudinaryService.deleteImage(image.publicId, 'products');
            });
        }
        return this.productRepository.update(id, updateProductDto);
    }
    async remove(id) {
        const prod = await this.findOne(id);
        await this.cloudinaryService.deleteImage(id, 'products');
        if (prod.data.image?.publicId) {
            this.cloudinaryService.deleteImage(prod.data.image.publicId, 'products');
        }
        if (prod.data.images) {
            prod.data.images.forEach((image) => {
                this.cloudinaryService.deleteImage(image.publicId, 'products');
            });
        }
        const deleted = await this.productRepository.delete(id);
        if (deleted.affected !== 1) {
            throw new common_1.BadRequestException('Product not Deleted');
        }
        return {
            message: 'Product deleted successfully',
            success: true,
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], ProductsService);
//# sourceMappingURL=products.service.js.map