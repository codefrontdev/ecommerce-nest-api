import { UserRole, UserStatus } from 'src/utils/enums';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    country?: string;
    city?: string;
    email: string;
    password: string;
    role: UserRole.ADMIN | UserRole.CUSTOMER | UserRole.SUPER_ADMIN | UserRole.CONTENT_ADMIN | UserRole.GEST;
    status: UserStatus;
    phone?: string;
    address?: string;
    zip?: string;
    profilePicture?: {
        publicId: string;
        url: string;
    };
}
