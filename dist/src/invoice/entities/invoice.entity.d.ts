import { Order } from 'src/orders/entities/order.entity';
export declare class Invoice {
    id: string;
    order: Order;
    invoicePDF: string;
    invoiceNumber: string;
    issuedAt: Date;
    dueAt: Date;
    QRCode: string;
}
