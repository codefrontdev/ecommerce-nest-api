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
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const brand_entity_1 = require("./entites/brand.entity");
const cloudinary_service_1 = require("../@core/shared/cloudinary.service");
let BrandsService = class BrandsService {
    brandRepository;
    cloudinaryService;
    constructor(brandRepository, cloudinaryService) {
        this.brandRepository = brandRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async create(createbrandDto) {
        return this.brandRepository.save(createbrandDto);
    }
    async findAll(filter) {
        const { search, page = 1, pageSize = 10 } = filter;
        const whereConditions = {};
        if (search) {
            whereConditions.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        const [brands, total] = await this.brandRepository.findAndCount({
            where: whereConditions,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            message: 'brands found successfully',
            success: true,
            brands,
            total,
            page,
            lastPage: Math.ceil(total / pageSize),
            currentPage: page,
            nextPage: page < Math.ceil(total / pageSize) ? page + 1 : null,
            pageSize,
        };
    }
    async findOne(id) {
        const brand = await this.brandRepository.findOneBy({ id });
        if (!brand) {
            throw new common_1.NotFoundException('brand not found');
        }
        return {
            message: 'brand found successfully',
            success: true,
            data: brand,
        };
    }
    update({ id }, updatebrandDto) {
        return this.brandRepository.update(id, updatebrandDto);
    }
    async remove(id) {
        const brand = await this.findOne(id);
        if (!brand.success) {
            throw new common_1.NotFoundException('brand not found');
        }
        if (brand?.data.logo) {
            await this.cloudinaryService.deleteImage(brand?.data.logo.publicId, 'brands');
        }
        const deleted = await this.brandRepository.delete(id);
        if (deleted.affected !== 1) {
            throw new common_1.BadRequestException('brand not Deleted');
        }
        return {
            message: 'brand deleted successfully',
            success: true,
        };
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], BrandsService);
//# sourceMappingURL=brands.service.js.map