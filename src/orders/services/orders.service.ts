import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { JWTPayloadType } from 'src/utils/types';
import { UpdateOrdersDto } from '../dto/update-order.dto';
import { PaymentDetails } from '../../payments/entities/payment.entity';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { User } from 'src/users/entities/user.entity';
import { PayPalService } from './paypal.service';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { OrderHelperService } from './order-helper.service';
import { CouponService } from 'src/coupons/coupons.service';
import { UserStatus } from 'src/utils/enums';

export interface OrderStatusCount {
  failed: {
    abanded: number;
    returned: number;
    canceled: number;
    damaged: number;
  };
  succeeded: {
    total: number;
    pending: number;
    completed: number;
    progress: number;
  };
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,

    @InjectRepository(PaymentDetails)
    private readonly paymentRepository: Repository<PaymentDetails>,
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,

    private readonly usersService: UsersService,

    private readonly couponService: CouponService,

    private readonly authService: AuthService,

    private readonly payPalService: PayPalService,
    private readonly orderHelperService: OrderHelperService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    req: Request,
    res: Response,
    payload?: JWTPayloadType,
  ): Promise<{
    message: string;
    success: boolean;
    data: Order | { order: Order; paypalApprovalUrl: string };
  }> {
    const user = await this.usersService.prepareUser(
      {
        email: createOrderDto.email,
        firstName: createOrderDto.firstName,
        lastName: createOrderDto.lastName,
        phone: createOrderDto.phone,
        country: createOrderDto.country,
        city: createOrderDto.city,
        address: createOrderDto.deliveryAddress,
        zip: createOrderDto.zip,
      },
      payload,
    );
    const { accessToken, refreshToken } =
      await this.authService.prepareSessionTokens(req, user);

    const { orderItems, subTotal, discountTotal } =
      await this.orderHelperService.calculateOrderItems(createOrderDto.items);

    let couponDiscount = 0;

    if (createOrderDto.couponCode) {
      const coupon = await this.couponService.validateCoupon(
        createOrderDto.couponCode,
      );
      if (coupon) {
        couponDiscount = coupon.data.discount || 0;
      }
    }

    const totalDiscount = discountTotal + couponDiscount;

    const { shippingCharge, estimatedTax, totalAmount } =
      this.orderHelperService.calculateOrderTotals(subTotal, totalDiscount);

    const order = await this.orderHelperService.saveOrder(
      createOrderDto,
      user.id,
      subTotal,
      discountTotal,
      shippingCharge,
      estimatedTax,
      totalAmount,
      createOrderDto.couponCode,
    );
    await this.orderHelperService.saveOrderItems(order, orderItems);
    await this.orderHelperService.createTrackingAndInvoice(order.id);

    if (
      createOrderDto.paymentMethod === 'new_card' &&
      createOrderDto.paymentDetails
    ) {
      await this.orderHelperService.saveCardPayment(
        order,
        createOrderDto.paymentDetails,
      );
    }

    if (createOrderDto.paymentMethod === 'paypal') {
      await this.orderHelperService.handlePaypalPayment(
        order,
        totalAmount,
        res,
        payload,
        accessToken,
        refreshToken,
      );
    }

    return {
      message: 'Order created successfully',
      success: true,
      data: order,
    };
  }

  async handlePayPalCallback(token, payerId, res: Response) {
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

    order.status = OrderStatus.COMPLETED;
    await this.ordersRepository.save(order);

    return res.redirect(
      `http://localhost:3000/order/${order.status.toLowerCase()}/${order.id}`,
    );
  }

  // الحصول على طلب حسب ID
  async findOne(
    id: string,
  ): Promise<{ message: string; success: boolean; data: Order }> {
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

  // الحصول على جميع الطلبات
  async findAll(query: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
    sort?: string;
    customer?: string;
    minTotal?: number;
    maxTotal?: number;
  }): Promise<{
    message: string;
    success: boolean;
    data: Order[];
    total: number;
    pageSize: number;
    orderStatusCounts: OrderStatusCount;
    totalPages: number;
    lastPage: number;
    page: number;
    nextPage: number | null;
  }> {
    const {
      page,
      pageSize,
      status,
      search,
      sort,
      customer,
      minTotal,
      maxTotal,
    } = query;

    const where = {};

    if (status) where['status'] = status;
    if (customer) where['user.id'] = customer;
    if (minTotal) where['total'] = MoreThanOrEqual(minTotal);
    if (maxTotal) where['total'] = LessThanOrEqual(maxTotal);

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

    const orderStatusCounts =
      this.orderHelperService.calculateOrderStatusCounts(orders);

    return {
      message: 'Orders found successfully',
      success: true,
      total,
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
      lastPage: Math.ceil(total / Number(pageSize)),
      page: Number(page),
      nextPage:
        Number(page) < Math.ceil(total / Number(pageSize))
          ? Number(page) + 1
          : null,
      orderStatusCounts,
      data: orders,
    };
  }

  // تحديث طلب
  async update(
    id: string,
    updateOrderDto: UpdateOrdersDto,
  ): Promise<{ message: string; success: boolean; data: Order }> {
    await this.ordersRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  // حذف طلب
  async remove(id: string): Promise<{ message: string; success: boolean }> {
    const order = await this.findOne(id);
    if (order) {
      // حذف العناصر التابعة للطلب أولاً
      await this.orderItemsRepository.delete({ order: order.data });

      await this.trackingRepository.delete({ order: order.data });

      await this.paymentRepository.delete({ order: order.data });

      // ثم حذف الطلب نفسه
      await this.ordersRepository.delete(id);
    }
    return {
      message: 'Order deleted successfully',
      success: true,
    };
  }
}
