import { Order } from 'src/orders/entities/order.entity';
type TrackingStep = {
    status: string;
    description: string;
    date: string;
    time: string;
};
export declare class Tracking {
    id: string;
    trackingNumber: string;
    order: Order;
    steps: TrackingStep[];
    createdAt: Date;
}
export {};
