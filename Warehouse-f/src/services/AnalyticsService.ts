import axios from 'axios';

const API_URL = 'http://localhost:8080/analytics';

export interface StockTurnoverResponse {
    productId: string;
    productName: string;
    totalMovements: number;
    turnoverRate: number;
}

export interface BlockUtilizationResponse {
    blockId: string;
    blockName: string;
    occupancyPercentage: number;
    utilizationLevel: string;
}

export interface FulfillmentMetricsResponse {
    avgPickTimeMinutes: number;
    avgPackTimeMinutes: number;
    avgDispatchTimeMinutes: number;
    avgTotalFulfillmentTimeMinutes: number;
}

export interface ShipmentMetricsResponse {
    totalShipments: number;
    shipmentsInTransit: number;
    deliveredToday: number;
    failedShipments: number;
}

export interface DashboardSummaryResponse {
    shipmentMetrics: ShipmentMetricsResponse;
    fulfillmentMetrics: FulfillmentMetricsResponse;
    topMovers: StockTurnoverResponse[];
    highUtilizationBlocks: BlockUtilizationResponse[];
}

export const AnalyticsService = {
    getDashboardSummary: async (): Promise<DashboardSummaryResponse> => {
        const response = await axios.get<any>(`${API_URL}/dashboard-summary`);
        // Handle Wrapped ResponseStructure
        return response.data.data;
    },

    getStockTurnover: async (): Promise<StockTurnoverResponse[]> => {
        const response = await axios.get<any>(`${API_URL}/stock-turnover`);
        return response.data.data;
    },

    getBlockUtilization: async (): Promise<BlockUtilizationResponse[]> => {
        const response = await axios.get<any>(`${API_URL}/block-utilization`);
        return response.data.data;
    },

    getFulfillmentMetrics: async (): Promise<FulfillmentMetricsResponse> => {
        const response = await axios.get<any>(`${API_URL}/fulfillment-metrics`);
        return response.data.data;
    },

    getShipmentMetrics: async (): Promise<ShipmentMetricsResponse> => {
        const response = await axios.get<any>(`${API_URL}/shipment-metrics`);
        return response.data.data;
    }
};
