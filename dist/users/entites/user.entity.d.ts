import { DeviceHistory } from 'src/deviceHistory/entites/device-history.entity';
import { Review } from 'src/reviews/entites/review.entity';
import { UserRole, UserStatus } from 'src/@core/utils/enums';
import { Order } from 'src/orders/entites/order.entity';
import { Comment } from 'src/comments/entites/comment.entity';
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
