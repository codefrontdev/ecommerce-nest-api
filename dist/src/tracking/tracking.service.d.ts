import { Repository } from 'typeorm';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { Order } from 'src/orders/entities/order.entity';
import { Tracking } from './entities/tracking.entity';
import { CreateStepDto } from './dto/create-step.dto';
export declare class TrackingService {
    private trackingRepository;
    private orderRepository;
    constructor(trackingRepository: Repository<Tracking>, orderRepository: Repository<Order>);
    create(dto: CreateTrackingDto): Promise<{
        message: string;
        data: Tracking;
        success: boolean;
    }>;
    findAll(): Promise<{
        message: string;
        data: Tracking[];
        success: boolean;
    }>;
    findByOrder(orderId: string): Promise<{
        message: string;
        data: Tracking[];
        success: boolean;
    }>;
    addStepToTracking(id: string, createStepDto: CreateStepDto): Promise<{
        message: string;
        data: Tracking;
        success: boolean;
    }>;
}
