// src/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entites/order.entity';
import { OrderItem } from './entites/order-item.entity';
import { JWTPayloadType } from 'src/@core/utils/types';
import { UpdateOrdersDto } from './dto/update-order.dto';
import { PaymentDetails } from '../payments/entites/payment.entity';
import { Tracking } from 'src/tracking/entites/tracking.entity';
import { ProductsService } from 'src/products/products.service';
import { InvoiceService } from 'src/invoice/invoice.service';

interface OrderStatusCount {
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

    private readonly invoiceService: InvoiceService,
  ) {}

  // إنشاء طلب جديد
  async create(
    createOrderDto: CreateOrderDto,
    payload: JWTPayloadType,
  ): Promise<{ message: string; success: boolean; data: Order }> {
    const {
      items,
      total,
      paymentMethod,
      amount,
      paymentDetails: paymentInfo,
    } = createOrderDto;
    const userId = payload.id;

    // إنشاء الكائن Order
    const order = this.ordersRepository.create({
      user: { id: userId },
      paymentMethod,
      amount,
      total,
    });
    const savedOrder = await this.ordersRepository.save(order);

    // حفظ العناصر التابعة للطلب
    if (items && items.length) {
      const orderItems = items.map((item) =>
        this.orderItemsRepository.create({
          price: item.price,
          quantity: item.quantity,
          product: { id: item.productId },
          order: savedOrder,
        }),
      );

      await this.orderItemsRepository.save(orderItems);
    }

    // إنشاء تفاصيل الدفع (PaymentDetails)
    const paymentDetailsEntity = this.paymentRepository.create({
      order: savedOrder,
      paymentMethod,
      cardHolderName: paymentInfo.cardHolderName,
      cardNumber: paymentInfo.cardNumber,
    });
    await this.paymentRepository.save(paymentDetailsEntity);

    // إنشاء تتبع (Tracking) مع الخطوات الافتراضية
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
    if (minTotal) where['total'] = { $gte: minTotal };
    if (maxTotal) where['total'] = { $lte: maxTotal };

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

  private calculateOrderStatusCounts(orders: Order[]): OrderStatusCount {
    const orderStatusCounts: OrderStatusCount = {
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
      if (order.status === 'pending') orderStatusCounts.succeeded.pending++;
      if (order.status === 'completed') orderStatusCounts.succeeded.completed++;
      if (order.status === 'progress') orderStatusCounts.succeeded.progress++;
      if (order.status === 'returned') orderStatusCounts.failed.returned++;
      if (order.status === 'canceled') orderStatusCounts.failed.canceled++;
      if (order.status === 'damaged') orderStatusCounts.failed.damaged++;
      orderStatusCounts.succeeded.total++;
    });

    return orderStatusCounts;
  }
}
