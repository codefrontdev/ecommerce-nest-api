import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
export declare class Comment {
    id: string;
    text: string;
    order: Order;
    user: User;
    createdAt: Date;
}
