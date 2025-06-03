import { Brand } from 'src/brands/entites/brand.entity';
import { Category } from 'src/categories/entites/category.entity';
import { OrderItem } from 'src/orders/entites/order-item.entity';
import { Review } from 'src/reviews/entites/review.entity';
import { BaseEntity } from 'typeorm';
export declare class Product extends BaseEntity {
    id: string;
    name: string;
    description: string;
    category: Category;
    categoryId: string;
    brand: Brand;
    brandId: string;
    tags: string[];
    shortDescription: string;
    status: string;
    visibility: string;
    publishDate: Date;
    manufacturerName: string;
    manufacturerBrand: string;
    stock: number;
    price: number;
    discount: number;
    orders: number;
    image: {
        url: string;
        publicId: string | null;
    };
    images?: {
        url: string;
        publicId: string;
    }[];
    reviews: Review[];
    orderItems: OrderItem[];
    colors: string[];
    sizes: string[];
    attributes: string[];
    attributesValues: string[];
    createdAt: Date;
    updatedAt: Date;
}
