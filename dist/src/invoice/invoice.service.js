"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const email_service_1 = require("./../@core/shared/email.service");
const common_1 = require("@nestjs/common");
const invoice_entity_1 = require("./entities/invoice.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const QRCode = require("qrcode");
const orders_service_1 = require("../orders/orders.service");
const puppeteer_1 = require("puppeteer");
let InvoiceService = class InvoiceService {
    invoiceRepo;
    ordersService;
    emailService;
    constructor(invoiceRepo, ordersService, emailService) {
        this.invoiceRepo = invoiceRepo;
        this.ordersService = ordersService;
        this.emailService = emailService;
    }
    async create(createInvoiceDto) {
        const order = await this.ordersService.findOne(createInvoiceDto.orderId);
        const existingInvoice = await this.invoiceRepo.findOne({
            where: { order: { id: order.data.id } },
        });
        if (existingInvoice)
            return existingInvoice;
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
        const totalAmount = subTotal - +discountValue + shippingCharge + estimatedTax;
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
        const qrCode = await QRCode.toDataURL(JSON.stringify({
            ...invoiceData,
            customerName: order.data.user.firstName + ' ' + order.data.user.lastName,
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
        }));
        const invoice = this.invoiceRepo.create({
            ...invoiceData,
            order: { id: invoiceData.orderId },
            QRCode: qrCode,
            invoicePDF: Buffer.from(pdfBuffer).toString('base64'),
        });
        return this.invoiceRepo.save(invoice);
    }
    async generateInvoicePDF(orderData) {
        const browser = await puppeteer_1.default.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
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
            .map((item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${item.total}</td>
                </tr>
              `)
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
        await page.setContent(htmlContent);
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
    findOne(id) {
        const invoice = this.invoiceRepo.findOne({
            where: { id },
            relations: ['order'],
        });
        if (!invoice)
            throw new Error('Invoice not found');
        return {
            message: 'Invoice found',
            data: invoice,
            success: true,
        };
    }
    update(id, updateInvoiceDto) {
        return `This action updates a #${id} invoice`;
    }
    remove(id) {
        return `This action removes a #${id} invoice`;
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => orders_service_1.OrdersService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        orders_service_1.OrdersService,
        email_service_1.EmailService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map