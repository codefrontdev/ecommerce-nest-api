import { TrackingService } from './tracking.service';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { CreateStepDto } from './dto/create-step.dto';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    create(dto: CreateTrackingDto): Promise<{
        message: string;
        data: import("./entities/tracking.entity").Tracking;
        success: boolean;
    }>;
    findAll(): Promise<{
        message: string;
        data: import("./entities/tracking.entity").Tracking[];
        success: boolean;
    }>;
    findByOrder(orderId: string): Promise<{
        message: string;
        data: import("./entities/tracking.entity").Tracking[];
        success: boolean;
    }>;
    addStep(id: string, dto: CreateStepDto): Promise<{
        message: string;
        data: import("./entities/tracking.entity").Tracking;
        success: boolean;
    }>;
}
