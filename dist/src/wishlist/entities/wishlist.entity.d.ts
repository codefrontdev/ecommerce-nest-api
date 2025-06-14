import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
export declare class Wishlist {
    id: string;
    user: User;
    product: Product;
    createdAt: Date;
}
