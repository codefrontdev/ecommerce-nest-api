import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PayPalService {
  private client: paypal.core.PayPalHttpClient;

  private readonly baseUrl: string = 'http://localhost:5000';
  
  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:5000');
    const env = new paypal.core.SandboxEnvironment(
      this.configService.get<string>('PAYPAL_CLIENT_ID', ''),
      this.configService.get<string>('PAYPAL_SECRET', ''),
      
    );
    this.client = new paypal.core.PayPalHttpClient(env);
  }

  async createOrder(totalAmount: number) {
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
        cancel_url: `${this.baseUrl}/order/cancelled`, // أو أي صفحة تلغي الطلب
      },
    });

    const response = await this.client.execute(request);
    return response.result;
  }

  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const response = await this.client.execute(request);
    return response.result;
  }
}