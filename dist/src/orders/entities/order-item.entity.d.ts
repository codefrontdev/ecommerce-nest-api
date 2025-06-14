import { Order } from './order.entity';
import { Product } from 'src/products/entities/product.entity';
export declare class OrderItem {
    id: string;
    quantity: number;
    color?: string;
    size?: string;
    price: number;
    product: Product;
    order: Order;
    createdAt: Date;
}
