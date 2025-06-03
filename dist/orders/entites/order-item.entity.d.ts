import { Order } from './order.entity';
import { Product } from 'src/products/entites/product.entity';
export declare class OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: Product;
    order: Order;
    createdAt: Date;
}
