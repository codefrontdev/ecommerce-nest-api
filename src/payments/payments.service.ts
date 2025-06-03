import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentDetails } from './entities/payment.entity';
import { Order } from 'src/orders/entities/order.entity';

interface CreatePaymentDto {
  paymentMethod: string;
  cardHolderName: string;
  cardNumber: string;
  orderId: string;
}

@Injectable()
export class PaymentDetailsService {
  constructor(
    @InjectRepository(PaymentDetails)
    private readonly paymentRepository: Repository<PaymentDetails>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // إنشاء بيانات الدفع
  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentDetails> {
    const { orderId, paymentMethod, cardHolderName, cardNumber } =
      createPaymentDto;

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const payment = this.paymentRepository.create({
      order,
      paymentMethod,
      cardHolderName,
      cardNumber,
    });

    return this.paymentRepository.save(payment);
  }

  // الحصول على بيانات الدفع حسب الطلب
  async findByOrderId(orderId: string): Promise<PaymentDetails> {
    const payment = await this.paymentRepository.findOne({
      where: { order: { id: orderId } },
      relations: ['order'],
    });

    if (!payment) throw new NotFoundException('Payment details not found');

    return payment;
  }

  // حذف بيانات الدفع
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Payment not found');
    }

    return { message: 'Payment deleted successfully' };
  }
}
