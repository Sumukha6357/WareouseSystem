import httpClient from '@/lib/httpClient';
import type {
    DashboardSummaryResponse,
    StockTurnoverResponse,
    BlockUtilizationResponse,
    FulfillmentMetricsResponse,
    ShipmentMetricsResponse,
} from '@/types/api';

export const AnalyticsService = {
    getDashboardSummary: (): Promise<DashboardSummaryResponse> =>
        httpClient.get('/analytics/dashboard-summary'),

    getStockTurnover: (): Promise<StockTurnoverResponse[]> =>
        httpClient.get('/analytics/stock-turnover'),

    getBlockUtilization: (): Promise<BlockUtilizationResponse[]> =>
        httpClient.get('/analytics/block-utilization'),

    getFulfillmentMetrics: (): Promise<FulfillmentMetricsResponse> =>
        httpClient.get('/analytics/fulfillment-metrics'),

    getShipmentMetrics: (): Promise<ShipmentMetricsResponse> =>
        httpClient.get('/analytics/shipment-metrics'),
};
