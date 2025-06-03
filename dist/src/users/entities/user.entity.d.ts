import { UserRole, UserStatus } from 'src/@core/utils/enums';
import { Comment } from 'src/comments/entites/comment.entity';
import { DeviceHistory } from 'src/deviceHistory/entities/device-history.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    comments: Comment[];
    phone: string;
    country: string;
    city: string;
    postalCode: string;
    website: string;
    about: string;
    address: string;
    profilePicture: {
        publicId: string;
        url: string;
    };
    status: UserStatus;
    failedAttempts: number;
    lastFailedAttempt: Date | null;
    deviceHistory: DeviceHistory[];
    orders: Order[];
    reviews: Review[];
    createdAt: Date;
    updatedAt: Date;
}
