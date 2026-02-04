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

export interface InventoryAgingResponse {
    inventoryId: string;
    productName: string;
    blockName: string;
    quantity: number;
    daysInWarehouse: number;
}

export interface ProcessAgingResponse {
    orderId: string;
    orderNumber: string;
    status: string;
    hoursInState: number;
}

export interface DashboardSummaryResponse {
    shipmentMetrics: ShipmentMetricsResponse;
    fulfillmentMetrics: FulfillmentMetricsResponse;
    topMovers: StockTurnoverResponse[];
    highUtilizationBlocks: BlockUtilizationResponse[];
    agingInventory: InventoryAgingResponse[];
    stuckOrders: ProcessAgingResponse[];
    pickHeatmap: PickHeatmapResponse[];
    pickerWorkload: PickerWorkloadResponse[];
    stockConfidence: StockConfidenceResponse[];
    shipmentRisk: ShipmentRiskResponse[];
}

export interface PickHeatmapResponse {
    blockId: string;
    blockName: string;
    activePicksCount: number;
    congestionLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface PickerWorkloadResponse {
    username: string;
    activeTaskCount: number;
    completedTodayCount: number;
    status: 'IDLE' | 'ACTIVE' | 'OVERLOADED';
}

export interface StockConfidenceResponse {
    productId: string;
    productName: string;
    confidenceScore: number;
    confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string;
}

export interface ShipmentRiskResponse {
    shipmentId: string;
    trackingNumber: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
    probabilityOfDelay: number; // 0-1
    detectedIssue: string;
}

export const AnalyticsService = {
    getDashboardSummary: async (): Promise<DashboardSummaryResponse> => {
        const response = await axios.get<{ data: DashboardSummaryResponse }>(`${API_URL}/dashboard-summary`);
        // Handle Wrapped ResponseStructure
        return response.data.data;
    },

    getStockTurnover: async (): Promise<StockTurnoverResponse[]> => {
        const response = await axios.get<{ data: StockTurnoverResponse[] }>(`${API_URL}/stock-turnover`);
        return response.data.data;
    },

    getBlockUtilization: async (): Promise<BlockUtilizationResponse[]> => {
        const response = await axios.get<{ data: BlockUtilizationResponse[] }>(`${API_URL}/block-utilization`);
        return response.data.data;
    },

    getFulfillmentMetrics: async (): Promise<FulfillmentMetricsResponse> => {
        const response = await axios.get<{ data: FulfillmentMetricsResponse }>(`${API_URL}/fulfillment-metrics`);
        return response.data.data;
    },

    getShipmentMetrics: async (): Promise<ShipmentMetricsResponse> => {
        const response = await axios.get<{ data: ShipmentMetricsResponse }>(`${API_URL}/shipment-metrics`);
        return response.data.data;
    }
};
