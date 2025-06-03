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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("../orders/entites/order.entity");
const product_entity_1 = require("../products/entites/product.entity");
const typeorm_2 = require("typeorm");
const analytics_entity_1 = require("./entities/analytics.entity");
const device_history_entity_1 = require("../deviceHistory/entites/device-history.entity");
let AnalyticsService = class AnalyticsService {
    orderRepository;
    productRepository;
    analyticsRepository;
    deviceHistoryRepository;
    constructor(orderRepository, productRepository, analyticsRepository, deviceHistoryRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.analyticsRepository = analyticsRepository;
        this.deviceHistoryRepository = deviceHistoryRepository;
    }
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
        const { start: startOfDay, end: endOfDay } = this.getStartAndEndOfDate(today);
        const { start: startOfYesterday, end: endOfYesterday } = this.getStartAndEndOfDate(yesterday);
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
            filter: { status: order_entity_1.OrderStatus.COMPLETED },
        });
        const inventoryChart = await this.buildChart({
            pastDays,
            repository: this.productRepository,
            dateField: 'createdAt',
        });
        const todayOrders = await this.orderRepository.find({
            where: { createdAt: (0, typeorm_2.Between)(startOfDay, endOfDay) },
        });
        const revenueToday = todayOrders.reduce((total, order) => total + Number(order.total), 0);
        const yesterdayOrders = await this.orderRepository.find({
            where: { createdAt: (0, typeorm_2.Between)(startOfYesterday, endOfYesterday) },
        });
        const revenueYesterday = yesterdayOrders.reduce((total, order) => total + Number(order.total), 0);
        const totalTransactionsToday = await this.countBetween(this.orderRepository, 'createdAt', startOfDay, endOfDay, { status: order_entity_1.OrderStatus.COMPLETED });
        const totalTransactionsYesterday = await this.countBetween(this.orderRepository, 'createdAt', startOfYesterday, endOfYesterday, { status: order_entity_1.OrderStatus.COMPLETED });
        const totalInventoryToday = await this.countBetween(this.productRepository, 'createdAt', startOfDay, endOfDay);
        const totalInventoryYesterday = await this.countBetween(this.productRepository, 'createdAt', startOfYesterday, endOfYesterday);
        const totalVisitorsToday = await this.countBetween(this.deviceHistoryRepository, 'loginAt', startOfDay, endOfDay);
        const totalVisitorsYesterday = await this.countBetween(this.deviceHistoryRepository, 'loginAt', startOfYesterday, endOfYesterday);
        return {
            revenue: {
                value: revenueToday,
                percentage: this.calculatePercentage(revenueToday, revenueYesterday),
                chart: revenueChart,
            },
            visitors: {
                value: totalVisitorsToday,
                percentage: this.calculatePercentage(totalVisitorsToday, totalVisitorsYesterday),
                chart: visitorsChart,
            },
            transactions: {
                value: totalTransactionsToday,
                percentage: this.calculatePercentage(totalTransactionsToday, totalTransactionsYesterday),
                chart: transactionsChart,
            },
            inventory: {
                value: totalInventoryToday,
                percentage: this.calculatePercentage(totalInventoryToday, totalInventoryYesterday),
                chart: inventoryChart,
            },
        };
    }
    async getSales(period) {
        const now = new Date();
        let fromDate;
        if (period === 'weekly') {
            fromDate = new Date(now);
            fromDate.setDate(now.getDate() - 7);
        }
        else if (period === 'monthly') {
            fromDate = new Date(now);
            fromDate.setMonth(now.getMonth() - 1);
        }
        else {
            fromDate = new Date(now);
            fromDate.setFullYear(now.getFullYear() - 1);
        }
        const orders = await this.orderRepository.find({
            where: {
                createdAt: (0, typeorm_2.Between)(fromDate, new Date()),
            },
        });
        const salesData = [];
        if (period === 'weekly') {
            for (let i = 6; i >= 0; i--) {
                const day = new Date(now);
                day.setDate(now.getDate() - i);
                const dateLabel = day.toLocaleString('default', {
                    day: '2-digit',
                    month: 'short',
                });
                const totalSales = orders
                    .filter((order) => new Date(order.createdAt).toDateString() === day.toDateString())
                    .reduce((total, order) => total + Number(order.total), 0);
                salesData.push({ date: dateLabel, sales: totalSales });
            }
        }
        else if (period === 'monthly') {
            for (let i = 0; i < 30; i++) {
                const day = new Date(now);
                day.setDate(now.getDate() - i);
                const dateLabel = day.toLocaleString('default', {
                    day: '2-digit',
                    month: 'short',
                });
                const totalSales = orders
                    .filter((order) => new Date(order.createdAt).toDateString() === day.toDateString())
                    .reduce((total, order) => total + Number(order.total), 0);
                salesData.push({ date: dateLabel, sales: totalSales });
            }
        }
        else if (period === 'yearly') {
            for (let i = 0; i < 12; i++) {
                const month = new Date(now);
                month.setMonth(now.getMonth() - i);
                const monthLabel = month.toLocaleString('default', { month: 'short' });
                const totalSales = orders
                    .filter((order) => new Date(order.createdAt).getMonth() === month.getMonth())
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
    async getSalesByCategory(period) {
        const now = new Date();
        let startDate;
        switch (period) {
            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                throw new Error('Invalid period');
        }
        try {
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
        }
        catch (error) {
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
    async getTopSellingProducts(sortBy) {
        try {
            let orderColumn = 'SUM(orderItem.quantity)';
            let orderDirection = 'DESC';
            if (sortBy === 'price') {
                orderColumn = 'product.price';
            }
            else if (sortBy === 'totalEarning') {
                orderColumn = 'SUM(orderItem.quantity * product.price)';
            }
            else if (sortBy === 'Sold') {
                orderColumn = 'SUM(orderItem.quantity)';
            }
            const queryBuilder = this.productRepository
                .createQueryBuilder('product')
                .leftJoin('product.orderItems', 'orderItem')
                .select([
                'product.id AS id',
                'product.name AS name',
                'SUM(orderItem.quantity) AS sales',
                'product.price AS price',
                'product.image AS image',
                'product.stock AS stock',
                'SUM(orderItem.quantity * product.price) AS totalEarning',
                'product.orders AS orders',
            ])
                .groupBy('product.id')
                .orderBy(orderColumn, orderDirection)
                .limit(8);
            queryBuilder.having('SUM(orderItem.quantity) > 0');
            const result = await queryBuilder.getRawMany();
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
        }
        catch (error) {
            console.error('Error fetching top-selling products:', error);
            return {
                message: 'An error occurred while fetching the top-selling products.',
                success: false,
                data: [],
            };
        }
    }
    getStartAndEndOfDate(date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return { start, end };
    }
    calculatePercentage(today, yesterday) {
        return yesterday > 0
            ? ((today - yesterday) / yesterday) * 100
            : today > 0
                ? 100
                : 0;
    }
    async countBetween(repository, field, start, end, extraWhere = {}) {
        return repository.count({
            where: {
                [field]: (0, typeorm_2.Between)(start, end),
                ...extraWhere,
            },
        });
    }
    async buildChart({ pastDays, repository, dateField, valueField, filter = {}, sum = false, }) {
        return Promise.all(pastDays.map(async (day) => {
            const data = await repository.find({
                where: {
                    [dateField]: (0, typeorm_2.Between)(day.start, day.end),
                    ...filter,
                },
            });
            const value = sum
                ? data.reduce((acc, item) => acc + Number(item[valueField]), 0)
                : data.length;
            return { name: day.name, uv: value };
        }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(analytics_entity_1.Analytics)),
    __param(3, (0, typeorm_1.InjectRepository)(device_history_entity_1.DeviceHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map