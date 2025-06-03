import { Product } from 'src/products/entites/product.entity';
import { BaseEntity } from 'typeorm';
export declare class Brand extends BaseEntity {
    id: string;
    name: string;
    logo?: {
        publicId: string;
        url: string;
    };
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
