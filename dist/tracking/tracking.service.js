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
exports.TrackingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../orders/entites/order.entity");
const tracking_entity_1 = require("./entites/tracking.entity");
let TrackingService = class TrackingService {
    trackingRepository;
    orderRepository;
    constructor(trackingRepository, orderRepository) {
        this.trackingRepository = trackingRepository;
        this.orderRepository = orderRepository;
    }
    async create(dto) {
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
            steps,
        });
        const saved = await this.trackingRepository.save(tracking);
        return { message: 'Tracking created', data: saved, success: true };
    }
    async findAll() {
        const trackings = await this.trackingRepository.find({
            relations: ['order'],
        });
        return { message: 'All trackings', data: trackings, success: true };
    }
    async findByOrder(orderId) {
        const trackings = await this.trackingRepository.find({
            where: { order: { id: orderId } },
            relations: ['order'],
        });
        return { message: 'Tracking for order', data: trackings, success: true };
    }
    async addStepToTracking(id, createStepDto) {
        const tracking = await this.trackingRepository.findOne({
            where: { order: { id: createStepDto.orderId }, id: id },
        });
        if (!tracking) {
            throw new Error('Tracking not found');
        }
        const now = new Date();
        const newStep = {
            status: createStepDto.status,
            description: createStepDto.description,
            date: now.toISOString().split('T')[0],
            time: now.toLocaleTimeString(),
        };
        tracking.steps.push(newStep);
        const updatedTracking = await this.trackingRepository.save(tracking);
        return {
            message: 'Step added to tracking',
            data: updatedTracking,
            success: true,
        };
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tracking_entity_1.Tracking)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TrackingService);
//# sourceMappingURL=tracking.service.js.map