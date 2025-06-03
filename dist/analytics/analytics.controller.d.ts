import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
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
            sales: import("../@core/utils/types").SalesData[];
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
    getTopSelling(sortBy: 'price' | 'Sold' | 'totalEarning'): Promise<{
        message: string;
        success: boolean;
        data: any;
    }>;
}
