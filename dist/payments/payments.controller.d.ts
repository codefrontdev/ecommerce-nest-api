import { PaymentDetailsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentDetailsController {
    private readonly paymentService;
    constructor(paymentService: PaymentDetailsService);
    create(body: CreatePaymentDto): Promise<{
        message: string;
        success: boolean;
        data: import("./entities/payment.entity").PaymentDetails;
    }>;
    findByOrder(orderId: string): Promise<{
        message: string;
        success: boolean;
        data: import("./entities/payment.entity").PaymentDetails;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
