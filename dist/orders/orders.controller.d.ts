import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entites/order.entity';
import { JWTPayloadType } from 'src/@core/utils/types';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(payload: JWTPayloadType, createOrderDto: CreateOrderDto): Promise<{
        message: string;
        success: boolean;
        data: Order;
    }>;
    findAll(query: {
        page: number;
        pageSize: number;
        status: string;
        search: string;
        sort: string;
        customer: string;
        minTotal: number;
        maxTotal: number;
    }): Promise<{
        message: string;
        success: boolean;
        data: Order[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        success: boolean;
        data: Order;
    }>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
