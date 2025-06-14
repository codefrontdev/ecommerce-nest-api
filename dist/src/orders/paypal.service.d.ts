import { ConfigService } from '@nestjs/config';
export declare class PayPalService {
    private configService;
    private client;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    createOrder(totalAmount: number): Promise<any>;
    captureOrder(orderId: string, token: string): Promise<any>;
}
