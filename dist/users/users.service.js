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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entites/user.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const hashPassword = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashPassword;
        const userExists = await this.userRepository.findOneBy({
            email: createUserDto.email,
        });
        if (userExists) {
            throw new common_1.UnauthorizedException('User already exists');
        }
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }
    async findAll(query) {
        const { status, search, page = 1, pageSize = 10 } = query;
        const whereConditions = {};
        if (status && status !== 'All') {
            whereConditions.status = status;
        }
        if (search) {
            whereConditions.name = (0, typeorm_1.Like)(`%${search}%`);
        }
        const [users, total] = await this.userRepository.findAndCount({
            where: whereConditions,
            skip: (page - 1) * pageSize,
            take: pageSize,
            relations: ['orders'],
        });
        return {
            message: 'users found successfully',
            success: true,
            page,
            lastPage: Math.ceil(total / pageSize),
            totalPages: Math.ceil(total / pageSize),
            nextPage: page < Math.ceil(total / pageSize) ? page + 1 : null,
            pageSize,
            users,
            total,
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['orders', 'reviews', 'deviceHistory', 'comments'],
            select: [
                'id',
                'firstName',
                'lastName',
                'email',
                'role',
                'status',
                'phone',
                'country',
                'city',
                'postalCode',
                'website',
                'address',
                'profilePicture',
                'failedAttempts',
                'lastFailedAttempt',
                'createdAt',
                'updatedAt',
            ],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async findOneByEmail(email) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async update(id, updateUserDto) {
        console.log('updateUserDto', updateUserDto);
        const newData = {
            ...updateUserDto,
        };
        if (newData.password) {
            newData.password = await bcrypt.hash(newData.password, 10);
        }
        await this.updateUser(id, newData);
        const updatedUser = await this.findOne(id);
        return {
            message: 'User updated successfully',
            success: true,
            data: updatedUser,
        };
    }
    async updateUser(id, updateUserDto) {
        await this.findOne(id);
        const result = await this.userRepository.update(id, {
            ...updateUserDto,
        });
        console.log(result);
        return result;
    }
    async remove(id) {
        await this.findOne(id);
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return result;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map