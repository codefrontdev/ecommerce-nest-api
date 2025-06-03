import { User } from 'src/users/entites/user.entity';
import { Order } from 'src/orders/entites/order.entity';
export declare class Comment {
    id: string;
    text: string;
    order: Order;
    user: User;
    createdAt: Date;
}
