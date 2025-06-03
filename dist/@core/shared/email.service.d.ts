import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendActivationEmail(email: string, activationCode: string): Promise<void>;
    sendInvoice(invoiceData: {
        email: string;
        message: string;
        attachPdf?: boolean;
        pdfBuffer?: string;
        date: Date;
        invoiceNumber: string;
        status: string;
    }): Promise<void>;
}
