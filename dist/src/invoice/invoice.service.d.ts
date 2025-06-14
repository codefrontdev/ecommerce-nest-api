import { EmailService } from '../shared/email.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { OrdersService } from 'src/orders/services/orders.service';
export declare class InvoiceService {
    private readonly invoiceRepo;
    private readonly ordersService;
    private readonly emailService;
    constructor(invoiceRepo: Repository<Invoice>, ordersService: OrdersService, emailService: EmailService);
    create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice>;
    generateInvoicePDF(orderData: any): Promise<Uint8Array<ArrayBufferLike>>;
    sendInvoice(invoiceData: any): Promise<void>;
    findOne(id: string): {
        message: string;
        data: Promise<Invoice | null>;
        success: boolean;
    };
    update(id: number, updateInvoiceDto: UpdateInvoiceDto): string;
    remove(id: number): string;
}
