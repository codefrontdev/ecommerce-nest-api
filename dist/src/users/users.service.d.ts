import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JWTPayloadType } from 'src/utils/types';
import { CreateUserGestDto } from './dto/create-gest-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(query: {
        status?: string;
        search?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        message: string;
        success: boolean;
        users: User[];
        page: number;
        lastPage: number;
        totalPages: number;
        nextPage: number | null;
        pageSize: number;
        total: number;
    }>;
    findOne(id: string): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        success: boolean;
        data: User;
    }>;
    updateUser(id: string, updateUserDto: any): Promise<import("typeorm").UpdateResult>;
    prepareUser(dto: CreateUserGestDto, payload?: JWTPayloadType): Promise<User>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
