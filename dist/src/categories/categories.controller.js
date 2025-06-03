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
exports.categoriesController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const user_role_decorator_1 = require("../auth/decorators/user-role.decorator");
const enums_1 = require("../@core/utils/enums");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const update_category_dto_1 = require("./dto/update-category.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const parse_uuid_pipe_1 = require("../@core/pipes/parse-uuid.pipe");
const get_by_id_dto_1 = require("./dto/get-by-id.dto");
let categoriesController = class categoriesController {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async create(createCategoryDto) {
        return await this.categoriesService.create(createCategoryDto);
    }
    findAll(query) {
        return this.categoriesService.findAll(query);
    }
    findOne(id) {
        return this.categoriesService.findOne(id);
    }
    update(id, updateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }
    remove(id) {
        return this.categoriesService.remove(id);
    }
};
exports.categoriesController = categoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], categoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], categoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', parse_uuid_pipe_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], categoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', parse_uuid_pipe_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_by_id_dto_1.GetByIdDto,
        update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], categoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, user_role_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CONTENT_ADMIN, enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', parse_uuid_pipe_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], categoriesController.prototype, "remove", null);
exports.categoriesController = categoriesController = __decorate([
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.categoriesService])
], categoriesController);
//# sourceMappingURL=categories.controller.js.map