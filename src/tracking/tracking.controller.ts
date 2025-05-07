import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { CreateStepDto } from './dto/create-step.dto';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  create(@Body() dto: CreateTrackingDto) {
    return this.trackingService.create(dto);
  }

  @Get()
  findAll() {
    return this.trackingService.findAll();
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.trackingService.findByOrder(orderId);
  }

  @Get(':id')
  addStep(@Param('id') id: string, @Body() dto: CreateStepDto) {
    return this.trackingService.addStepToTracking(id,dto);
  }
}
