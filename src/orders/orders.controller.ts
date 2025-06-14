// src/orders/orders.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { JWTPayloadType } from 'src/utils/types';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/user-role.decorator';
import { UserRole } from 'src/utils/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request, Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @CurrentUser() payload: JWTPayloadType,
    @Res() res: Response,
    @Req() req: Request,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{
    message: string;
    success: boolean;
    data: Order | { order: Order; paypalApprovalUrl: string };
  }> {
    return this.ordersService.create(createOrderDto, req, res, payload);
  }

  @Get()
  async findAll(
    @Query()
    query: {
      page: number;
      pageSize: number;
      status: string;
      search: string;
      sort: string;
      customer: string;
      minTotal: number;
      maxTotal: number;
    },
  ): Promise<{
    message: string;
    success: boolean;
    data: Order[];
  }> {
    return this.ordersService.findAll(query);
  }
  @Get('paypal/callback')
  async handlePayPalCallback(
    @Query('token') token: string,
    @Query('PayerID') payerId: string,
    @Res() res: Response,
  ) {
    return this.ordersService.handlePayPalCallback(token, payerId, res);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ message: string; success: boolean; data: Order }> {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ message: string; success: boolean }> {
    return this.ordersService.remove(id);
  }
}
