import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { Order } from 'src/orders/entites/order.entity';
import { Tracking } from './entites/tracking.entity';
import { CreateStepDto } from './dto/create-step.dto';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Tracking)
    private trackingRepository: Repository<Tracking>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // إنشاء تتبع مع خطوات افتراضية
  async create(dto: CreateTrackingDto) {
    const order = await this.orderRepository.findOne({
      where: { id: dto.orderId },
    });
    if (!order) {
      throw new Error('Order not found');
    }

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
      order,
      trackingNumber: `TRACK-${order.id}`,
      steps, // إضافة الخطوات الافتراضية
    });

    const saved = await this.trackingRepository.save(tracking);
    return { message: 'Tracking created', data: saved, success: true };
  }

  // استرجاع كل التتبع الخاص بالطلبات
  async findAll() {
    const trackings = await this.trackingRepository.find({
      relations: ['order'],
    });
    return { message: 'All trackings', data: trackings, success: true };
  }

  // استرجاع تتبع معين بناءً على orderId
  async findByOrder(orderId: string) {
    const trackings = await this.trackingRepository.find({
      where: { order: { id: orderId } },
      relations: ['order'],
    });
    return { message: 'Tracking for order', data: trackings, success: true };
  }

  // إضافة خطوة جديدة للتتبع
  async addStepToTracking(
    id: string, createStepDto: CreateStepDto) {
    const tracking = await this.trackingRepository.findOne({
      where: { order: { id: createStepDto.orderId }, id: id },
    });

    if (!tracking) {
      throw new Error('Tracking not found');
    }

    const now = new Date();
    const newStep = {
      status: createStepDto.status,
      description:createStepDto.description,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString(),
    };

    tracking.steps.push(newStep); // إضافة خطوة جديدة

    const updatedTracking = await this.trackingRepository.save(tracking);
    return {
      message: 'Step added to tracking',
      data: updatedTracking,
      success: true,
    };
  }
}
