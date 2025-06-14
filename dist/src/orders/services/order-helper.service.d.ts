import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ProductsService } from 'src/products/products.service';
import { OrderItem } from '../entities/order-item.entity';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { PaymentDetails } from 'src/payments/entities/payment.entity';
import { InvoiceService } from 'src/invoice/invoice.service';
import { PayPalService } from './paypal.service';
import { OrderStatusCount } from './orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { JWTPayloadType } from 'src/utils/types';
export declare class OrderHelperService {
    private productsService;
    private orderItemsRepository;
    private ordersRepository;
    private trackingRepository;
    private paymentRepository;
    private invoiceService;
    private payPalService;
    private config;
    constructor(productsService: ProductsService, orderItemsRepository: Repository<OrderItem>, ordersRepository: Repository<Order>, trackingRepository: Repository<Tracking>, paymentRepository: Repository<PaymentDetails>, invoiceService: InvoiceService, payPalService: PayPalService, config: ConfigService);
    calculateOrderStatusCounts(orders: Order[]): OrderStatusCount;
    calculateOrderItems(items: {
        productId: string;
        quantity: number;
    }[]): Promise<{
        orderItems: OrderItem[];
        subTotal: number;
        discountTotal: number;
    }>;
    calculateOrderTotals(subTotal: number, discount: number): {
        shippingCharge: number;
        estimatedTax: number;
        totalAmount: number;
    };
    saveOrder(dto: CreateOrderDto, userId: string, subTotal: number, discount: number, shippingCharge: number, estimatedTax: number, totalAmount: number, couponCode?: string): Promise<Order>;
    saveOrderItems(order: Order, items: OrderItem[]): Promise<void>;
    createTrackingAndInvoice(orderId: string): Promise<void>;
    saveCardPayment(order: Order, paymentInfo: any): Promise<void>;
    handlePaypalPayment(order: Order, totalAmount: number, res: Response, payload?: JWTPayloadType, accessToken?: string, refreshToken?: string): Promise<Response<any, Record<string, any>>>;
}
