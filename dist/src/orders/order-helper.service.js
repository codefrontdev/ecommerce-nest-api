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
exports.OrderHelperService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const products_service_1 = require("../products/products.service");
const order_item_entity_1 = require("./entities/order-item.entity");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const tracking_entity_1 = require("../tracking/entities/tracking.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const invoice_service_1 = require("../invoice/invoice.service");
const paypal_service_1 = require("./paypal.service");
let OrderHelperService = class OrderHelperService {
    productsService;
    orderItemsRepository;
    ordersRepository;
    trackingRepository;
    paymentRepository;
    invoiceService;
    payPalService;
    config;
    constructor(productsService, orderItemsRepository, ordersRepository, trackingRepository, paymentRepository, invoiceService, payPalService, config) {
        this.productsService = productsService;
        this.orderItemsRepository = orderItemsRepository;
        this.ordersRepository = ordersRepository;
        this.trackingRepository = trackingRepository;
        this.paymentRepository = paymentRepository;
        this.invoiceService = invoiceService;
        this.payPalService = payPalService;
        this.config = config;
    }
    calculateOrderStatusCounts(orders) {
        const orderStatusCounts = {
            failed: {
                abanded: 0,
                returned: 0,
                canceled: 0,
                damaged: 0,
            },
            succeeded: {
                total: 0,
                pending: 0,
                completed: 0,
                progress: 0,
            },
        };
        orders.forEach((order) => {
            if (order.status === 'pending')
                orderStatusCounts.succeeded.pending++;
            if (order.status === 'completed')
                orderStatusCounts.succeeded.completed++;
            if (order.status === 'progress')
                orderStatusCounts.succeeded.progress++;
            if (order.status === 'returned')
                orderStatusCounts.failed.returned++;
            if (order.status === 'canceled')
                orderStatusCounts.failed.canceled++;
            if (order.status === 'damaged')
                orderStatusCounts.failed.damaged++;
            orderStatusCounts.succeeded.total++;
        });
        return orderStatusCounts;
    }
    async calculateOrderItems(items) {
        let subTotal = 0;
        let discountTotal = 0;
        const orderItems = [];
        for (const item of items) {
            const { data: product } = await this.productsService.findOne(item.productId);
            if (!product)
                continue;
            const price = Number(product.price) || 0;
            const discount = Number(product.discount) || 0;
            const quantity = item.quantity || 1;
            const finalPrice = price * quantity;
            const discountAmount = (price * discount * quantity) / 100;
            subTotal += finalPrice;
            discountTotal += discountAmount;
            orderItems.push(this.orderItemsRepository.create({
                price,
                quantity,
                product: { id: product.id },
            }));
        }
        return {
            orderItems,
            subTotal,
            discountTotal: Number(discountTotal.toFixed(2)),
        };
    }
    calculateOrderTotals(subTotal, discount) {
        const shippingCharge = subTotal - discount > 100 ? 0 : 15;
        const estimatedTax = Number(((subTotal - discount) * 0.05).toFixed(2));
        const totalAmount = subTotal - discount + shippingCharge + estimatedTax;
        return { shippingCharge, estimatedTax, totalAmount };
    }
    async saveOrder(dto, userId, subTotal, discount, shippingCharge, estimatedTax, totalAmount) {
        const order = this.ordersRepository.create({
            user: { id: userId },
            paymentMethod: dto.paymentMethod,
            streetAddress: dto.streetAddress,
            deliveryAddress: dto.deliveryAddress,
            state: dto.state,
            shippingCharge,
            estimatedTax,
            discount,
            amount: totalAmount,
            total: subTotal,
        });
        return await this.ordersRepository.save(order);
    }
    async saveOrderItems(order, items) {
        for (const item of items) {
            item.order = order;
        }
        await this.orderItemsRepository.save(items);
    }
    async createTrackingAndInvoice(orderId) {
        const now = new Date();
        const steps = [
            {
                status: 'Order Placed',
                description: 'An order has been placed',
                date: now.toISOString().split('T')[0],
                time: now.toLocaleTimeString(),
            },
        ];
        const tracking = this.trackingRepository.create({
            order: { id: orderId },
            trackingNumber: `TRACK-${orderId}`,
            steps,
        });
        await this.trackingRepository.save(tracking);
        await this.invoiceService.create({ orderId });
    }
    async saveCardPayment(order, paymentInfo) {
        const payment = this.paymentRepository.create({
            order,
            paymentMethod: 'new_card',
            cardHolderName: paymentInfo.cardHolderName,
            cardNumber: paymentInfo.cardNumber,
        });
        await this.paymentRepository.save(payment);
    }
    async handlePaypalPayment(order, totalAmount, res, payload, accessToken, refreshToken) {
        const paypalOrder = await this.payPalService.createOrder(totalAmount);
        order.transitionId = paypalOrder.id;
        await this.ordersRepository.save(order);
        const approvalLink = paypalOrder.links.find((link) => link.rel === 'approve');
        if (!payload) {
            const isProduction = this.config.get('NODE_ENV') === 'production';
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 1000 * 60 * 15,
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });
        }
        return {
            message: 'Redirect to PayPal',
            success: true,
            data: {
                order,
                paypalApprovalUrl: approvalLink?.href,
            },
        };
    }
};
exports.OrderHelperService = OrderHelperService;
exports.OrderHelperService = OrderHelperService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(3, (0, typeorm_1.InjectRepository)(tracking_entity_1.Tracking)),
    __param(4, (0, typeorm_1.InjectRepository)(payment_entity_1.PaymentDetails)),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        invoice_service_1.InvoiceService,
        paypal_service_1.PayPalService,
        config_1.ConfigService])
], OrderHelperService);
//# sourceMappingURL=order-helper.service.js.map