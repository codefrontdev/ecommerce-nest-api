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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entites/order.entity");
const order_item_entity_1 = require("./entites/order-item.entity");
const payment_entity_1 = require("../payments/entites/payment.entity");
const tracking_entity_1 = require("../tracking/entites/tracking.entity");
const invoice_service_1 = require("../invoice/invoice.service");
let OrdersService = class OrdersService {
    ordersRepository;
    orderItemsRepository;
    paymentRepository;
    trackingRepository;
    invoiceService;
    constructor(ordersRepository, orderItemsRepository, paymentRepository, trackingRepository, invoiceService) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.paymentRepository = paymentRepository;
        this.trackingRepository = trackingRepository;
        this.invoiceService = invoiceService;
    }
    async create(createOrderDto, payload) {
        const { items, total, paymentMethod, amount, paymentDetails: paymentInfo, } = createOrderDto;
        const userId = payload.id;
        const order = this.ordersRepository.create({
            user: { id: userId },
            paymentMethod,
            amount,
            total,
        });
        const savedOrder = await this.ordersRepository.save(order);
        if (items && items.length) {
            const orderItems = items.map((item) => this.orderItemsRepository.create({
                price: item.price,
                quantity: item.quantity,
                product: { id: item.productId },
                order: savedOrder,
            }));
            await this.orderItemsRepository.save(orderItems);
        }
        const paymentDetailsEntity = this.paymentRepository.create({
            order: savedOrder,
            paymentMethod,
            cardHolderName: paymentInfo.cardHolderName,
            cardNumber: paymentInfo.cardNumber,
        });
        await this.paymentRepository.save(paymentDetailsEntity);
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
            order: savedOrder,
            trackingNumber: `TRACK-${savedOrder.id}`,
            steps,
        });
        await this.trackingRepository.save(tracking);
        await this.invoiceService.create({ orderId: savedOrder.id });
        return {
            data: savedOrder,
            message: 'Order created successfully',
            success: true,
        };
    }
    async findOne(id) {
        const order = await this.ordersRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'item')
            .leftJoin('order.user', 'user')
            .leftJoin('item.product', 'product')
            .leftJoinAndSelect('order.paymentDetails', 'paymentDetails')
            .leftJoinAndSelect('order.tracking', 'tracking')
            .leftJoinAndSelect('order.comments', 'comments')
            .leftJoinAndSelect('order.invoice', 'invoice')
            .where('order.id = :id', { id })
            .select([
            'order',
            'item',
            'invoice',
            'user.email',
            'user.firstName',
            'user.lastName',
            'user.country',
            'user.city',
            'user.postalCode',
            'user.phone',
            'user.address',
            'user.profilePicture',
            'user.role',
            'paymentDetails',
            'tracking',
            'comments',
            'product.id',
            'product.name',
            'product.price',
            'product.image',
            'product.discount',
        ])
            .getOne();
        if (!order) {
            throw new Error('Order not found');
        }
        return {
            message: 'Order found successfully',
            success: true,
            data: order,
        };
    }
    async findAll(query) {
        const { page, pageSize, status, search, sort, customer, minTotal, maxTotal, } = query;
        const where = {};
        if (status)
            where['status'] = status;
        if (minTotal)
            where['total'] = { $gte: minTotal };
        if (maxTotal)
            where['total'] = { $lte: maxTotal };
        const qb = this.ordersRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.product', 'product');
        if (search) {
            qb.andWhere('user.name LIKE :search', { search: `%${search}%` });
        }
        qb.skip((Number(page) - 1) * Number(pageSize))
            .take(pageSize)
            .orderBy('order.createdAt', sort === 'asc' ? 'ASC' : 'DESC');
        const [orders, total] = await qb.getManyAndCount();
        const orderStatusCounts = this.calculateOrderStatusCounts(orders);
        return {
            message: 'Orders found successfully',
            success: true,
            total,
            pageSize: Number(pageSize),
            totalPages: Math.ceil(total / Number(pageSize)),
            lastPage: Math.ceil(total / Number(pageSize)),
            page: Number(page),
            nextPage: Number(page) < Math.ceil(total / Number(pageSize)) ? Number(page) + 1 : null,
            orderStatusCounts,
            data: orders,
        };
    }
    async update(id, updateOrderDto) {
        await this.ordersRepository.update(id, updateOrderDto);
        return this.findOne(id);
    }
    async remove(id) {
        const order = await this.findOne(id);
        if (order) {
            await this.orderItemsRepository.delete({ order: order.data });
            await this.trackingRepository.delete({ order: order.data });
            await this.paymentRepository.delete({ order: order.data });
            await this.ordersRepository.delete(id);
        }
        return {
            message: 'Order deleted successfully',
            success: true,
        };
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.PaymentDetails)),
    __param(3, (0, typeorm_1.InjectRepository)(tracking_entity_1.Tracking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        invoice_service_1.InvoiceService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map