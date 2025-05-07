import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('sales')
  getSales(@Query('period') period: 'weekly' | 'monthly' | 'yearly') {
    return this.analyticsService.getSales(period);
  }

  @Get('sales-by-category')
  getSalesByCategory(@Query('period') period: 'weekly' | 'monthly' | 'yearly') {
    return this.analyticsService.getSalesByCategory(period);
  }

  @Get('top-selling')
  getTopSelling(@Query('sortBy') sortBy: 'price' | 'Sold' | 'totalEarning') {
    console.log('top selling', sortBy);
    return this.analyticsService.getTopSellingProducts(sortBy);
  }
}
