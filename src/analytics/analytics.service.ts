import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from 'src/orders/entites/order.entity';
import { Product } from 'src/products/entites/product.entity';
import { Between, Repository } from 'typeorm';
import { Analytics } from './entities/analytics.entity';
import { DeviceHistory } from 'src/deviceHistory/entites/device-history.entity';
import { SalesData } from 'src/@core/utils/types';
@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,

    @InjectRepository(DeviceHistory)
    private readonly deviceHistoryRepository: Repository<DeviceHistory>,
  ) {}

  async saveDailySnapshot() {
    const overview = await this.getOverview();

    const snapshot = this.analyticsRepository.create({
      revenueToday: overview.revenue.value,
      visitors: overview.visitors.value,
      transactions: overview.transactions.value,
      inventory: overview.inventory.value,
    });

    return this.analyticsRepository.save(snapshot);
  }
  async getOverview() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const { start: startOfDay, end: endOfDay } =
      this.getStartAndEndOfDate(today);
    const { start: startOfYesterday, end: endOfYesterday } =
      this.getStartAndEndOfDate(yesterday);

    const pastDays = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const { start, end } = this.getStartAndEndOfDate(date);

      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        start,
        end,
      };
    });

    const revenueChart = await this.buildChart({
      pastDays,
      repository: this.orderRepository,
      dateField: 'createdAt',
      valueField: 'total',
      sum: true,
    });

    const visitorsChart = await this.buildChart({
      pastDays,
      repository: this.deviceHistoryRepository,
      dateField: 'loginAt',
    });

    const transactionsChart = await this.buildChart({
      pastDays,
      repository: this.orderRepository,
      dateField: 'createdAt',
      filter: { status: OrderStatus.COMPLETED },
    });

    const inventoryChart = await this.buildChart({
      pastDays,
      repository: this.productRepository,
      dateField: 'createdAt',
    });

    const todayOrders = await this.orderRepository.find({
      where: { createdAt: Between(startOfDay, endOfDay) },
    });

    const revenueToday = todayOrders.reduce(
      (total, order) => total + Number(order.total),
      0,
    );

    const yesterdayOrders = await this.orderRepository.find({
      where: { createdAt: Between(startOfYesterday, endOfYesterday) },
    });

    const revenueYesterday = yesterdayOrders.reduce(
      (total, order) => total + Number(order.total),
      0,
    );

    const totalTransactionsToday = await this.countBetween(
      this.orderRepository,
      'createdAt',
      startOfDay,
      endOfDay,
      { status: OrderStatus.COMPLETED },
    );

    const totalTransactionsYesterday = await this.countBetween(
      this.orderRepository,
      'createdAt',
      startOfYesterday,
      endOfYesterday,
      { status: OrderStatus.COMPLETED },
    );

    const totalInventoryToday = await this.countBetween(
      this.productRepository,
      'createdAt',
      startOfDay,
      endOfDay,
    );

    const totalInventoryYesterday = await this.countBetween(
      this.productRepository,
      'createdAt',
      startOfYesterday,
      endOfYesterday,
    );

    const totalVisitorsToday = await this.countBetween(
      this.deviceHistoryRepository,
      'loginAt',
      startOfDay,
      endOfDay,
    );

    const totalVisitorsYesterday = await this.countBetween(
      this.deviceHistoryRepository,
      'loginAt',
      startOfYesterday,
      endOfYesterday,
    );

    return {
      revenue: {
        value: revenueToday,
        percentage: this.calculatePercentage(revenueToday, revenueYesterday),
        chart: revenueChart,
      },
      visitors: {
        value: totalVisitorsToday,
        percentage: this.calculatePercentage(
          totalVisitorsToday,
          totalVisitorsYesterday,
        ),
        chart: visitorsChart,
      },
      transactions: {
        value: totalTransactionsToday,
        percentage: this.calculatePercentage(
          totalTransactionsToday,
          totalTransactionsYesterday,
        ),
        chart: transactionsChart,
      },
      inventory: {
        value: totalInventoryToday,
        percentage: this.calculatePercentage(
          totalInventoryToday,
          totalInventoryYesterday,
        ),
        chart: inventoryChart,
      },
    };
  }

  async getSales(period: 'weekly' | 'monthly' | 'yearly') {
    const now = new Date();
    let fromDate: Date;

    if (period === 'weekly') {
      fromDate = new Date(now);
      fromDate.setDate(now.getDate() - 7); // آخر 7 أيام
    } else if (period === 'monthly') {
      fromDate = new Date(now);
      fromDate.setMonth(now.getMonth() - 1); // آخر شهر
    } else {
      fromDate = new Date(now);
      fromDate.setFullYear(now.getFullYear() - 1); // آخر سنة
    }

    const orders = await this.orderRepository.find({
      where: {
        createdAt: Between(fromDate, new Date()),
      },
    });

    const salesData: SalesData[] = [];

    if (period === 'weekly') {
      // جمع المبيعات الأسبوعية (آخر 7 أيام)
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i); // تأكد من أن اليوم في الأسبوع مضبوط بشكل صحيح
        const dateLabel = day.toLocaleString('default', {
          day: '2-digit',
          month: 'short',
        });

        const totalSales = orders
          .filter(
            (order) =>
              new Date(order.createdAt).toDateString() === day.toDateString(),
          )
          .reduce((total, order) => total + Number(order.total), 0);

        salesData.push({ date: dateLabel, sales: totalSales });
      }
    } else if (period === 'monthly') {
      // جمع المبيعات الشهرية (آخر شهر)
      for (let i = 0; i < 30; i++) {
        const day = new Date(now);
        day.setDate(now.getDate() - i); // تأكد من أن اليوم في الشهر مضبوط بشكل صحيح
        const dateLabel = day.toLocaleString('default', {
          day: '2-digit',
          month: 'short',
        });

        const totalSales = orders
          .filter(
            (order) =>
              new Date(order.createdAt).toDateString() === day.toDateString(),
          )
          .reduce((total, order) => total + Number(order.total), 0);

        salesData.push({ date: dateLabel, sales: totalSales });
      }
    } else if (period === 'yearly') {
      // جمع المبيعات السنوية (آخر سنة)
      for (let i = 0; i < 12; i++) {
        const month = new Date(now);
        month.setMonth(now.getMonth() - i); // تأكد من أن الشهر مضبوط بشكل صحيح
        const monthLabel = month.toLocaleString('default', { month: 'short' });

        const totalSales = orders
          .filter(
            (order) =>
              new Date(order.createdAt).getMonth() === month.getMonth(),
          )
          .reduce((total, order) => total + Number(order.total), 0);

        salesData.push({ date: monthLabel, sales: totalSales });
      }
    }
    return {
      message: 'success',
      success: true,
      data: {
        period,
        sales: salesData,
      },
    };
  }

  async getSalesByCategory(period: 'weekly' | 'monthly' | 'yearly'): Promise<{
    message: string;
    success: boolean;
    data: {
      period: string;
      sales: { name: string; value: number; productsCount: number }[];
    };
  }> {
    const now = new Date();
    let startDate: Date;

    // إعداد بداية الفترة بناءً على الفترة المحددة
    switch (period) {
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7); // آخر 7 أيام
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // أول يوم في الشهر الحالي
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1); // أول يوم في السنة الحالية
        break;
      default:
        throw new Error('Invalid period');
    }

    try {
      // استعلام لجلب المبيعات حسب الفئة
      const result = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .leftJoin('product.orderItems', 'orderItem')
        .where('"orderItem"."createdAt" >= :startDate', { startDate })
        .select('category.name', 'name')
        .addSelect('SUM(orderItem.quantity)', 'value')
        .addSelect('COUNT(product.id)', 'productsCount')
        .groupBy('category.name')
        .getRawMany();

      // معالجة البيانات وتحويل القيم إلى أرقام بشكل دقيق
      const sales = result.map((r) => ({
        name: r.name,
        value: parseFloat(r.value) || 0,
        productsCount: parseInt(r.productsCount, 10) || 0,
      }));

      return {
        message: 'success',
        success: true,
        data: {
          period,
          sales,
        },
      };
    } catch (error) {
      return {
        message: 'An error occurred while fetching sales data',
        success: false,
        data: {
          period,
          sales: [],
        },
      };
    }
  }

  async getTopSellingProducts(
    sortBy: 'price' | 'Sold' | 'totalEarning',
  ): Promise<{
    message: string;
    success: boolean;
    data: any;
  }> {
    try {
      // تحديد عمود الترتيب بناءً على sortBy
      let orderColumn = 'SUM(orderItem.quantity)'; // Default sorting by sales
      let orderDirection: 'DESC' | 'ASC' = 'DESC';

      if (sortBy === 'price') {
        orderColumn = 'product.price';
      } else if (sortBy === 'totalEarning') {
        orderColumn = 'SUM(orderItem.quantity * product.price)';
      } else if (sortBy === 'Sold') {
        orderColumn = 'SUM(orderItem.quantity)';
      }

      const queryBuilder = this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.orderItems', 'orderItem')
        .select([
          'product.id AS id',
          'product.name AS name',
          'SUM(orderItem.quantity) AS sales', // إجمالي المبيعات
          'product.price AS price',
          'product.image AS image',
          'product.stock AS stock',
          'SUM(orderItem.quantity * product.price) AS totalEarning', // إجمالي الأرباح
          'product.orders AS orders', // عدد الطلبات
        ])
        .groupBy('product.id')
        .orderBy(orderColumn, orderDirection) // ترتيب حسب العمود المطلوب
        .limit(8); // تحديد الحد الأقصى لعدد المنتجات المعروضة

      // إضافة تصفية بعد جمع الأعمدة (HAVING)
      queryBuilder.having('SUM(orderItem.quantity) > 0'); // تصفية المنتجات المباعة (sold)

      const result = await queryBuilder.getRawMany();

      // معالجة البيانات وتحويلها إلى الشكل المطلوب
      const data = result.map((r) => {
        const sales = r.sales ? parseInt(r.sales, 10) : 0;
        const price = r.price ? parseFloat(r.price) : 0;
        const totalEarning = sales * price;

        return {
          id: r.id,
          'Product Name': r.name,
          price: `$${price.toFixed(2)}`,
          status: 'In Stock',
          sold: sales,
          'total earning': `$${totalEarning.toFixed(2)}`,
          image: r.image
            ? JSON.parse(r.image).url
            : 'https://via.placeholder.com/150',
          orders: r.orders || 0,
        };
      });

      return {
        message: 'success',
        success: true,
        data,
      };
    } catch (error) {
      console.error('Error fetching top-selling products:', error);
      return {
        message: 'An error occurred while fetching the top-selling products.',
        success: false,
        data: [],
      };
    }
  }

  private getStartAndEndOfDate(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  private calculatePercentage(today: number, yesterday: number): number {
    return yesterday > 0
      ? ((today - yesterday) / yesterday) * 100
      : today > 0
        ? 100
        : 0;
  }

  private async countBetween(
    repository: Repository<any>,
    field: string,
    start: Date,
    end: Date,
    extraWhere: any = {},
  ): Promise<number> {
    return repository.count({
      where: {
        [field]: Between(start, end),
        ...extraWhere,
      },
    });
  }

  private async buildChart({
    pastDays,
    repository,
    dateField,
    valueField,
    filter = {},
    sum = false,
  }: {
    pastDays: any[];
    repository: Repository<any>;
    dateField: string;
    valueField?: string;
    filter?: object;
    sum?: boolean;
  }) {
    return Promise.all(
      pastDays.map(async (day) => {
        const data = await repository.find({
          where: {
            [dateField]: Between(day.start, day.end),
            ...filter,
          },
        });

        const value = sum
          ? data.reduce((acc, item) => acc + Number(item[valueField!]), 0)
          : data.length;

        return { name: day.name, uv: value };
      }),
    );
  }
}
