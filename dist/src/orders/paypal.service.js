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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPalService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const paypal = require("@paypal/checkout-server-sdk");
let PayPalService = class PayPalService {
    configService;
    client;
    baseUrl = 'http://localhost:5000';
    constructor(configService) {
        this.configService = configService;
        this.baseUrl = this.configService.get('BASE_URL', 'http://localhost:5000');
        const env = new paypal.core.SandboxEnvironment(this.configService.get('PAYPAL_CLIENT_ID', ''), this.configService.get('PAYPAL_SECRET', ''));
        this.client = new paypal.core.PayPalHttpClient(env);
    }
    async createOrder(totalAmount) {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: `${totalAmount}`,
                    },
                },
            ],
            application_context: {
                return_url: `${this.baseUrl}/api/v1/orders/paypal/callback`,
                cancel_url: `${this.baseUrl}/order/cancelled`,
            },
        });
        const response = await this.client.execute(request);
        return response.result;
    }
    async captureOrder(orderId) {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        const response = await this.client.execute(request);
        return response.result;
    }
};
exports.PayPalService = PayPalService;
exports.PayPalService = PayPalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PayPalService);
//# sourceMappingURL=paypal.service.js.map