import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entites/order.entity';
import { OrderItem } from './entites/order-item.entity';
import { JWTPayloadType } from 'src/@core/utils/types';
import { UpdateOrdersDto } from './dto/update-order.dto';
import { PaymentDetails } from '../payments/entites/payment.entity';
import { Tracking } from 'src/tracking/entites/tracking.entity';
import { InvoiceService } from 'src/invoice/invoice.service';
interface OrderStatusCount {
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
    private readonly invoiceService;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, paymentRepository: Repository<PaymentDetails>, trackingRepository: Repository<Tracking>, invoiceService: InvoiceService);
    create(createOrderDto: CreateOrderDto, payload: JWTPayloadType): Promise<{
        message: string;
        success: boolean;
        data: Order;
    }>;
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
    private calculateOrderStatusCounts;
}
export {};
