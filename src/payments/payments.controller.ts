// src/orders/controllers/payment-details.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PaymentDetailsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentDetailsController {
  constructor(private readonly paymentService: PaymentDetailsService) {}

  @Post()
  async create(@Body() body: CreatePaymentDto) {
    const payment = await this.paymentService.create(body);
    return {
      message: 'Payment created successfully',
      success: true,
      data: payment,
    };
  }

  @Get('order/:orderId')
  async findByOrder(@Param('orderId') orderId: string) {
    const payment = await this.paymentService.findByOrderId(orderId);
    return {
      message: 'Payment found successfully',
      success: true,
      data: payment,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.paymentService.remove(id);
    return {
      ...result,
      success: true,
    };
  }
}
