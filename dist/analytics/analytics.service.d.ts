import { Order } from 'src/orders/entites/order.entity';
import { Product } from 'src/products/entites/product.entity';
import { Repository } from 'typeorm';
import { Analytics } from './entities/analytics.entity';
import { DeviceHistory } from 'src/deviceHistory/entites/device-history.entity';
import { SalesData } from 'src/@core/utils/types';
export declare class AnalyticsService {
    private readonly orderRepository;
    private readonly productRepository;
    private readonly analyticsRepository;
    private readonly deviceHistoryRepository;
    constructor(orderRepository: Repository<Order>, productRepository: Repository<Product>, analyticsRepository: Repository<Analytics>, deviceHistoryRepository: Repository<DeviceHistory>);
    saveDailySnapshot(): Promise<Analytics>;
    getOverview(): Promise<{
        revenue: {
            value: number;
            percentage: number;
            chart: {
                name: any;
                uv: any;
            }[];
        };
        visitors: {
            value: number;
            percentage: number;
            chart: {
                name: any;
                uv: any;
            }[];
        };
        transactions: {
            value: number;
            percentage: number;
            chart: {
                name: any;
                uv: any;
            }[];
        };
        inventory: {
            value: number;
            percentage: number;
            chart: {
                name: any;
                uv: any;
            }[];
        };
    }>;
    getSales(period: 'weekly' | 'monthly' | 'yearly'): Promise<{
        message: string;
        success: boolean;
        data: {
            period: "weekly" | "monthly" | "yearly";
            sales: SalesData[];
        };
    }>;
    getSalesByCategory(period: 'weekly' | 'monthly' | 'yearly'): Promise<{
        message: string;
        success: boolean;
        data: {
            period: string;
            sales: {
                name: string;
                value: number;
                productsCount: number;
            }[];
        };
    }>;
    getTopSellingProducts(sortBy: 'price' | 'Sold' | 'totalEarning'): Promise<{
        message: string;
        success: boolean;
        data: any;
    }>;
    private getStartAndEndOfDate;
    private calculatePercentage;
    private countBetween;
    private buildChart;
}
