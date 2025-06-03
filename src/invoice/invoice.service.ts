import { EmailService } from '../shared/email.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import * as QRCode from 'qrcode';
import { OrdersService } from 'src/orders/orders.service';
import puppeteer from 'puppeteer';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,

    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,

    private readonly emailService: EmailService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const order = await this.ordersService.findOne(createInvoiceDto.orderId);

    const existingInvoice = await this.invoiceRepo.findOne({
      where: { order: { id: order.data.id } },
    });

    if (existingInvoice) return existingInvoice;

    const invoiceNumber = `INV-${new Date().getTime().toFixed(8)}`;
    const invoiceData = {
      orderId: order.data.id,
      invoiceNumber,
      amount: order.data.total,
      dueAt: new Date(),
      issuedAt: new Date(),
    };

    const subTotal = order.data.total;
    const discountValue = order.data.items
      .filter((item) => item.product)
      .reduce((acc, item) => {
        const price = item.product.price || 0;
        const discount = item.product.discount || 0;
        const qty = item.quantity || 1;
        const discountAmount = price * (discount / 100) * qty;
        return acc + discountAmount;
      }, 0)
      .toFixed(2);
    const shippingCharge = order.data?.total && order.data.total > 100 ? 0 : 15;
    const estimatedTax = order.data?.total && order.data.total * 0.05;
    const totalAmount =
      subTotal - +discountValue + shippingCharge + estimatedTax;

    const pdfBuffer = await this.generateInvoicePDF({
      ...invoiceData,
      customerName: order.data.user.firstName + ' ' + order.data.user.lastName,
      customerEmail: order.data.user.email,
      customerPhone: order.data.user.phone,
      customerAddress: order.data.user.address,
      paymentMethod: order.data.paymentMethod,
      items: order.data.items,
      subTotal: order.data.total,
      discount: discountValue,
      shippingCharge,
      estimatedTax,
      totalAmount,
    });

    const qrCode = await QRCode.toDataURL(
      JSON.stringify({
        ...invoiceData,
        customerName:
          order.data.user.firstName + ' ' + order.data.user.lastName,
        customerEmail: order.data.user.email,
        customerPhone: order.data.user.phone,
        customerAddress: order.data.user.address,
        paymentMethod: order.data.paymentMethod,
        items: order.data.items.map((item) => ({
          product: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })),
        subTotal,
        discount: discountValue,
        shippingCharge,
        estimatedTax,
        totalAmount,
      }),
    );
    const invoice = this.invoiceRepo.create({
      ...invoiceData,
      order: { id: invoiceData.orderId },
      QRCode: qrCode,
      invoicePDF: Buffer.from(pdfBuffer).toString('base64'),
    });
    return this.invoiceRepo.save(invoice);
  }

  async generateInvoicePDF(orderData) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // تنسيق HTML مع البيانات
    const htmlContent = `
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .container { width: 80%; margin: 20px auto; }
          .header { text-align: center; margin-bottom: 40px; }
          .header h1 { font-size: 32px; margin: 0; }
          .details { margin-bottom: 20px; }
          .details .left, .details .right { width: 48%; float: left; }
          .details .right { text-align: right; }
          .clear { clear: both; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          table, th, td { border: 1px solid #ddd; }
          th, td { padding: 8px; text-align: left; }
          .total { margin-top: 20px; text-align: right; font-size: 18px; }
          .total .label { font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invoice</h1>
            <p>Invoice #: ${orderData.invoiceNumber}</p>
            <p>Issued At: ${orderData.issuedAt}</p>
            <p>Due At: ${orderData.dueAt}</p>
          </div>
          <div class="details">
            <div class="left">
              <p><strong>Customer Details:</strong></p>
              <p>Name: ${orderData.customerName}</p>
              <p>Email: ${orderData.customerEmail}</p>
              <p>Phone: ${orderData.customerPhone || 'N/A'}</p>
              <p>Address: ${orderData.customerAddress || 'N/A'}</p>
            </div>
            <div class="right">
              <p><strong>Payment Method: ${orderData.paymentMethod}</strong></p>
            </div>
            <div class="clear"></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${item.total}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
          <div class="total">
            <p class="label">Subtotal: ${orderData.subtotal}</p>
            <p class="label">Discount: ${orderData.discount}</p>
            <p class="label">Shipping Charge: ${orderData.shippingCharge}</p>
            <p class="label">Estimated Tax: ${orderData.estimatedTax}</p>
            <p class="label">Total Amount: ${orderData.totalAmount}</p>
          </div>
          <div class="footer">
            <p>Thank you for your purchase!</p>
          </div>
        </div>
      </body>
    </html>
  `;

    // تحميل المحتوى في الصفحة
    await page.setContent(htmlContent);

    // إنشاء PDF
    const pdfBuffer = await page.pdf({
      path: 'invoice.pdf',
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
  }

  async sendInvoice(invoiceData) {
    const { orderId, message } = invoiceData;
    const order = await this.ordersService.findOne(orderId);

    const data = {
      email: order.data.user.email,
      message: message,
      attachPdf: true,
      pdfBuffer: order.data.invoice.invoicePDF,
      date: order.data.createdAt,
      invoiceNumber: order.data.invoice.invoiceNumber,
      status: order.data.status,
    };
    return this.emailService.sendInvoice(data);
  }

  findOne(id: string) {
    const invoice = this.invoiceRepo.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!invoice) throw new Error('Invoice not found');

    return {
      message: 'Invoice found',
      data: invoice,
      success: true,
    };
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
