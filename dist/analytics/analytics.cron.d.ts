import { AnalyticsService } from './analytics.service';
export declare class AnalyticsCron {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    handleCron(): Promise<void>;
}
