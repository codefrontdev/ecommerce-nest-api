import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(createInvoiceDto: CreateInvoiceDto): Promise<import("./entities/invoice.entity").Invoice>;
    sendInvoice(invoiceData: {
        orderId: string;
        message: string;
        attachPdf?: boolean;
    }): Promise<void>;
    findOne(id: string): {
        message: string;
        data: Promise<import("./entities/invoice.entity").Invoice | null>;
        success: boolean;
    };
    update(id: string, updateInvoiceDto: UpdateInvoiceDto): string;
    remove(id: string): string;
}
