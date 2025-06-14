import { OrdersService } from './services/orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { JWTPayloadType } from 'src/utils/types';
import { Request, Response } from 'express';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(payload: JWTPayloadType, res: Response, req: Request, createOrderDto: CreateOrderDto): Promise<{
        message: string;
        success: boolean;
        data: Order | {
            order: Order;
            paypalApprovalUrl: string;
        };
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
    handlePayPalCallback(token: string, payerId: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
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
