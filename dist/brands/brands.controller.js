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
exports.BrandsController = void 0;
const common_1 = require("@nestjs/common");
const user_role_decorator_1 = require("../auth/decorators/user-role.decorator");
const enums_1 = require("../@core/utils/enums");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const parse_uuid_pipe_1 = require("../@core/pipes/parse-uuid.pipe");
const get_by_id_dto_1 = require("./dto/get-by-id.dto");
const brands_service_1 = require("./brands.service");
const create_brand_dto_1 = require("./dto/create-brand.dto");
const update_brand_dto_1 = require("./dto/update-brand.dto");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("../@core/shared/cloudinary.service");
let BrandsController = class BrandsController {
    BrandsService;
    cloudinaryService;
    constructor(BrandsService, cloudinaryService) {
        this.BrandsService = BrandsService;
        this.cloudinaryService = cloudinaryService;
    }
    async create(files, createBrandDto) {
        if (files?.logo) {
            createBrandDto.logo = await this.cloudinaryService.upload(files.logo[0], 'brands');
        }
        return await this.BrandsService.create(createBrandDto);
    }
    findAll(query) {
        return this.BrandsService.findAll(query);
    }
    findOne(id) {
        return this.BrandsService.findOne(id);
    }
    update(id, updateBrandDto) {
        return this.BrandsService.update(id, updateBrandDto);
    }
    remove(id) {
        return this.BrandsService.remove(id);
    }
};
exports.BrandsController = BrandsController;
__decorate([
    (0, common_1.Post)(),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'logo', maxCount: 1 }])),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_brand_dto_1.CreateBrandDto]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BrandsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', parse_uuid_pipe_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', parse_uuid_pipe_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_by_id_dto_1.GetByIdDto,
        update_brand_dto_1.UpdateBrandDto]),
    __metadata("design:returntype", void 0)
], BrandsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', parse_uuid_pipe_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandsController.prototype, "remove", null);
exports.BrandsController = BrandsController = __decorate([
    (0, common_1.Controller)('brands'),
    __metadata("design:paramtypes", [brands_service_1.BrandsService,
        cloudinary_service_1.CloudinaryService])
], BrandsController);
//# sourceMappingURL=brands.controller.js.map