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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { JWTPayloadType } from 'src/@core/utils/types';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/user-role.decorator';
import { UserRole } from 'src/@core/utils/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() payload: JWTPayloadType,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ message: string; success: boolean; data: Order }> {
    return this.ordersService.create(createOrderDto, payload);
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
