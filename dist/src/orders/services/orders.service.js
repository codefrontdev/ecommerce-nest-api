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
const users_service_1 = require("../../users/users.service");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const payment_entity_1 = require("../../payments/entities/payment.entity");
const tracking_entity_1 = require("../../tracking/entities/tracking.entity");
const paypal_service_1 = require("./paypal.service");
const auth_service_1 = require("../../auth/auth.service");
const order_helper_service_1 = require("./order-helper.service");
const coupons_service_1 = require("../../coupons/coupons.service");
let OrdersService = class OrdersService {
    ordersRepository;
    orderItemsRepository;
    paymentRepository;
    trackingRepository;
    usersService;
    couponService;
    authService;
    payPalService;
    orderHelperService;
    constructor(ordersRepository, orderItemsRepository, paymentRepository, trackingRepository, usersService, couponService, authService, payPalService, orderHelperService) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.paymentRepository = paymentRepository;
        this.trackingRepository = trackingRepository;
        this.usersService = usersService;
        this.couponService = couponService;
        this.authService = authService;
        this.payPalService = payPalService;
        this.orderHelperService = orderHelperService;
    }
    async create(createOrderDto, req, res, payload) {
        const user = await this.usersService.prepareUser({
            email: createOrderDto.email,
            firstName: createOrderDto.firstName,
            lastName: createOrderDto.lastName,
            phone: createOrderDto.phone,
            country: createOrderDto.country,
            city: createOrderDto.city,
            address: createOrderDto.deliveryAddress,
            zip: createOrderDto.zip,
        }, payload);
        const { accessToken, refreshToken } = await this.authService.prepareSessionTokens(req, user);
        const { orderItems, subTotal, discountTotal } = await this.orderHelperService.calculateOrderItems(createOrderDto.items);
        let couponDiscount = 0;
        if (createOrderDto.couponCode) {
            const coupon = await this.couponService.validateCoupon(createOrderDto.couponCode);
            if (coupon) {
                couponDiscount = coupon.data.discount || 0;
            }
        }
        const totalDiscount = discountTotal + couponDiscount;
        const { shippingCharge, estimatedTax, totalAmount } = this.orderHelperService.calculateOrderTotals(subTotal, totalDiscount);
        const order = await this.orderHelperService.saveOrder(createOrderDto, user.id, subTotal, discountTotal, shippingCharge, estimatedTax, totalAmount, createOrderDto.couponCode);
        await this.orderHelperService.saveOrderItems(order, orderItems);
        await this.orderHelperService.createTrackingAndInvoice(order.id);
        if (createOrderDto.paymentMethod === 'new_card' &&
            createOrderDto.paymentDetails) {
            await this.orderHelperService.saveCardPayment(order, createOrderDto.paymentDetails);
        }
        if (createOrderDto.paymentMethod === 'paypal') {
            await this.orderHelperService.handlePaypalPayment(order, totalAmount, res, payload, accessToken, refreshToken);
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
        if (customer)
            where['user.id'] = customer;
        if (minTotal)
            where['total'] = (0, typeorm_2.MoreThanOrEqual)(minTotal);
        if (maxTotal)
            where['total'] = (0, typeorm_2.LessThanOrEqual)(maxTotal);
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
        const orderStatusCounts = this.orderHelperService.calculateOrderStatusCounts(orders);
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
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        coupons_service_1.CouponService,
        auth_service_1.AuthService,
        paypal_service_1.PayPalService,
        order_helper_service_1.OrderHelperService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map