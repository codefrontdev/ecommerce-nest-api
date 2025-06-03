import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CloudinaryService } from 'src/@core/shared/cloudinary.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JWTPayloadType } from 'src/@core/utils/types';
export declare class UsersController {
    private readonly usersService;
    private readonly cloudinaryService;
    constructor(usersService: UsersService, cloudinaryService: CloudinaryService);
    create(files: {
        profilePicture?: Express.Multer.File[];
    }, createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(query: {
        status?: string;
        search?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        message: string;
        success: boolean;
        users: import("./entities/user.entity").User[];
        page: number;
        lastPage: number;
        totalPages: number;
        nextPage: number | null;
        pageSize: number;
        total: number;
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    updateUser(file: Express.Multer.File, updateUserDto: UpdateUserDto, user: JWTPayloadType): Promise<{
        message: string;
        success: boolean;
        data: import("./entities/user.entity").User;
    }>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
