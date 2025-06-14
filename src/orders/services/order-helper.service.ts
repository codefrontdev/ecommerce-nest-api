import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { ProductsService } from 'src/products/products.service';
import { OrderItem } from '../entities/order-item.entity';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { PaymentDetails } from 'src/payments/entities/payment.entity';
import { InvoiceService } from 'src/invoice/invoice.service';
import { PayPalService } from './paypal.service';
import { OrderStatusCount } from './orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { JWTPayloadType } from 'src/utils/types';

@Injectable()
export class OrderHelperService {
  constructor(
    private productsService: ProductsService,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Tracking)
    private trackingRepository: Repository<Tracking>,
    @InjectRepository(PaymentDetails)
    private paymentRepository: Repository<PaymentDetails>,
    private invoiceService: InvoiceService,
    private payPalService: PayPalService,
    private config: ConfigService,
  ) {}

  public calculateOrderStatusCounts(orders: Order[]): OrderStatusCount {
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
  public async calculateOrderItems(
    items: { productId: string; quantity: number }[],
  ) {
    let subTotal = 0;
    let discountTotal = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const { data: product } = await this.productsService.findOne(
        item.productId,
      );
      if (!product) continue;

      const price = Number(product.price) || 0;
      const discount = Number(product.discount) || 0;
      const quantity = item.quantity || 1;

      const finalPrice = price * quantity;
      const discountAmount = (price * discount * quantity) / 100;

      subTotal += finalPrice;
      discountTotal += discountAmount;

      console.log('orderItems', orderItems);
      orderItems.push(
        this.orderItemsRepository.create({
          price,
          quantity,
          product: { id: product.id },
        }),
      );
    }
    this.productsService.updateStock(orderItems);
    console.log('orderItems', orderItems);
    return {
      orderItems,
      subTotal,
      discountTotal: Number(discountTotal.toFixed(2)),
    };
  }

  public calculateOrderTotals(subTotal: number, discount: number) {
    const shippingCharge = subTotal - discount > 100 ? 0 : 15;
    const estimatedTax = Number(((subTotal - discount) * 0.05).toFixed(2));
    const totalAmount = Number(
      (subTotal - discount + shippingCharge + estimatedTax).toFixed(2),
    );
    return { shippingCharge, estimatedTax, totalAmount };
  }

  public async saveOrder(
    dto: CreateOrderDto,
    userId: string,
    subTotal: number,
    discount: number,
    shippingCharge: number,
    estimatedTax: number,
    totalAmount: number,
    couponCode?: string,
  ) {
    const order = this.ordersRepository.create({
      ...(userId && { user: { id: userId } }),
      paymentMethod: dto.paymentMethod,
      streetAddress: dto.streetAddress,
      deliveryAddress: dto.deliveryAddress,
      state: dto.state,
      shippingCharge,
      estimatedTax,
      discount,
      amount: totalAmount,
      total: subTotal,
      ...(couponCode ? { couponCode } : {}),
    });
    return await this.ordersRepository.save(order);
  }

  public async saveOrderItems(order: Order, items: OrderItem[]) {
    for (const item of items) {
      item.order = order;
    }
    await this.orderItemsRepository.save(items);
  }

  public async createTrackingAndInvoice(orderId: string) {
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

  public async saveCardPayment(order: Order, paymentInfo: any) {
    const payment = this.paymentRepository.create({
      order,
      paymentMethod: 'new_card',
      cardHolderName: paymentInfo.cardHolderName,
      cardNumber: paymentInfo.cardNumber,
    });
    await this.paymentRepository.save(payment);
  }

  public async handlePaypalPayment(
    order: Order,
    totalAmount: number,
    res: Response,
    payload?: JWTPayloadType,
    accessToken?: string,
    refreshToken?: string,
  ) {
    const paypalOrder = await this.payPalService.createOrder(totalAmount);
    order.transitionId = paypalOrder.id;
    await this.ordersRepository.save(order);

    const approvalLink = paypalOrder.links.find(
      (link) => link.rel === 'approve',
    );

    if (!payload) {
      const isProduction = this.config.get<string>('NODE_ENV') === 'production';
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

    return res.status(200).json({
      message: 'Redirect to PayPal',
      success: true,
      data: {
        order,
        paypalApprovalUrl: approvalLink?.href,
      },
    });
  }
}
