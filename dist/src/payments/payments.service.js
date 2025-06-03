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
exports.PaymentDetailsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const order_entity_1 = require("../orders/entities/order.entity");
let PaymentDetailsService = class PaymentDetailsService {
    paymentRepository;
    orderRepository;
    constructor(paymentRepository, orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }
    async create(createPaymentDto) {
        const { orderId, paymentMethod, cardHolderName, cardNumber } = createPaymentDto;
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const payment = this.paymentRepository.create({
            order,
            paymentMethod,
            cardHolderName,
            cardNumber,
        });
        return this.paymentRepository.save(payment);
    }
    async findByOrderId(orderId) {
        const payment = await this.paymentRepository.findOne({
            where: { order: { id: orderId } },
            relations: ['order'],
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment details not found');
        return payment;
    }
    async remove(id) {
        const result = await this.paymentRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return { message: 'Payment deleted successfully' };
    }
};
exports.PaymentDetailsService = PaymentDetailsService;
exports.PaymentDetailsService = PaymentDetailsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.PaymentDetails)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentDetailsService);
//# sourceMappingURL=payments.service.js.map