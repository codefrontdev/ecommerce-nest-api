import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare class Review extends BaseEntity {
    id: string;
    product: Product;
    user: User;
    rating: number;
    comment: {
        title: string;
        body: string;
        images?: string[];
    };
    createdAt: Date;
}
