import { UserRole, UserStatus } from 'src/@core/utils/enums';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    country?: string;
    city?: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    phone?: string;
    address?: string;
    profilePicture?: {
        publicId: string;
        url: string;
    };
}
