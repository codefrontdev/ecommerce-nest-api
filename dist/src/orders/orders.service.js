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
const users_service_1 = require("../users/users.service");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const tracking_entity_1 = require("../tracking/entities/tracking.entity");
const user_entity_1 = require("../users/entities/user.entity");
const paypal_service_1 = require("./paypal.service");
const auth_service_1 = require("../auth/auth.service");
const order_helper_service_1 = require("./order-helper.service");
let OrdersService = class OrdersService {
    ordersRepository;
    orderItemsRepository;
    paymentRepository;
    trackingRepository;
    usersService;
    authService;
    payPalService;
    OrderHelperService;
    constructor(ordersRepository, orderItemsRepository, paymentRepository, trackingRepository, usersService, authService, payPalService, OrderHelperService) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.paymentRepository = paymentRepository;
        this.trackingRepository = trackingRepository;
        this.usersService = usersService;
        this.authService = authService;
        this.payPalService = payPalService;
        this.OrderHelperService = OrderHelperService;
    }
    async create(createOrderDto, req, res, payload) {
        const user = await this.usersService.prepareUser(createOrderDto, payload);
        const { accessToken, refreshToken } = await this.authService.prepareSessionTokens(req, user);
        const { orderItems, subTotal, discountTotal } = await this.OrderHelperService.calculateOrderItems(createOrderDto.items);
        const { shippingCharge, estimatedTax, totalAmount } = this.OrderHelperService.calculateOrderTotals(subTotal, discountTotal);
        const order = await this.OrderHelperService.saveOrder(createOrderDto, user.id, subTotal, discountTotal, shippingCharge, estimatedTax, totalAmount);
        await this.OrderHelperService.saveOrderItems(order, orderItems);
        await this.OrderHelperService.createTrackingAndInvoice(order.id);
        if (createOrderDto.paymentMethod === 'new_card' &&
            createOrderDto.paymentDetails) {
            await this.OrderHelperService.saveCardPayment(order, createOrderDto.paymentDetails);
        }
        if (createOrderDto.paymentMethod === 'paypal') {
            return this.OrderHelperService.handlePaypalPayment(order, totalAmount, res, payload, accessToken, refreshToken);
        }
        return {
            message: 'Order created successfully',
            success: true,
            data: order,
        };
    }
    async handlePayPalCallback(token, payerId, res) {
        const order = await this.ordersRepository.findOne({
            where: { transitionId: token },
        });
        if (!order) {
            return res.status(404).send('Order not found');
        }
        if (!order.transitionId) {
            return res.status(400).send('Order transitionId is missing.');
        }
        const result = await this.payPalService.captureOrder(order.transitionId);
        if (result.status !== 'COMPLETED') {
            return res.status(400).send('Payment failed.');
        }
        order.status = order_entity_1.OrderStatus.COMPLETED;
        await this.ordersRepository.save(order);
        return res.redirect(`http://localhost:3000/order/${order.status.toLowerCase()}/${order.id}`);
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
        const orderStatusCounts = this.OrderHelperService.calculateOrderStatusCounts(orders);
        return {
            message: 'Orders found successfully',
            success: true,
            total,
            pageSize: Number(pageSize),
            totalPages: Math.ceil(total / Number(pageSize)),
            lastPage: Math.ceil(total / Number(pageSize)),
            page: Number(page),
            nextPage: Number(page) < Math.ceil(total / Number(pageSize))
                ? Number(page) + 1
                : null,
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.PaymentDetails)),
    __param(3, (0, typeorm_1.InjectRepository)(tracking_entity_1.Tracking)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        auth_service_1.AuthService,
        paypal_service_1.PayPalService,
        order_helper_service_1.OrderHelperService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map