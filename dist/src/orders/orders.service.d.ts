import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { JWTPayloadType } from 'src/utils/types';
import { UpdateOrdersDto } from './dto/update-order.dto';
import { PaymentDetails } from '../payments/entities/payment.entity';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { PayPalService } from './paypal.service';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { OrderHelperService } from './order-helper.service';
export interface OrderStatusCount {
    failed: {
        abanded: number;
        returned: number;
        canceled: number;
        damaged: number;
    };
    succeeded: {
        total: number;
        pending: number;
        completed: number;
        progress: number;
    };
}
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private readonly paymentRepository;
    private readonly trackingRepository;
    private readonly usersService;
    private readonly authService;
    private readonly payPalService;
    private readonly OrderHelperService;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, paymentRepository: Repository<PaymentDetails>, trackingRepository: Repository<Tracking>, usersService: UsersService, authService: AuthService, payPalService: PayPalService, OrderHelperService: OrderHelperService);
    create(createOrderDto: CreateOrderDto, req: Request, res: Response, payload?: JWTPayloadType): Promise<{
        message: string;
        success: boolean;
        data: Order | {
            order: Order;
            paypalApprovalUrl: string;
        };
    }>;
    handlePayPalCallback(token: any, payerId: any, res: Response): Promise<void | Response<any, Record<string, any>>>;
    findOne(id: string): Promise<{
        message: string;
        success: boolean;
        data: Order;
    }>;
    findAll(query: {
        page?: number;
        pageSize?: number;
        status?: string;
        search?: string;
        sort?: string;
        customer?: string;
        minTotal?: number;
        maxTotal?: number;
    }): Promise<{
        message: string;
        success: boolean;
        data: Order[];
        total: number;
        pageSize: number;
        orderStatusCounts: OrderStatusCount;
        totalPages: number;
        lastPage: number;
        page: number;
        nextPage: number | null;
    }>;
    update(id: string, updateOrderDto: UpdateOrdersDto): Promise<{
        message: string;
        success: boolean;
        data: Order;
    }>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
