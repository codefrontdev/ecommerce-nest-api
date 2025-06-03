import { Product } from 'src/products/entites/product.entity';
import { BaseEntity } from 'typeorm';
export declare class Category extends BaseEntity {
    id: string;
    name: string;
    description?: string;
    tags?: string[];
    status: 'active' | 'inactive';
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
