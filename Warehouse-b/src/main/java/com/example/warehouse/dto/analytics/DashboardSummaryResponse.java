package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class DashboardSummaryResponse {
    private ShipmentMetricsResponse shipmentMetrics;
    private FulfillmentMetricsResponse fulfillmentMetrics;
    private List<StockTurnoverResponse> topMovers;
    private List<BlockUtilizationResponse> highUtilizationBlocks;
    private List<InventoryAgingResponse> agingInventory;
    private List<ProcessAgingResponse> stuckOrders;
    private List<PickHeatmapResponse> pickHeatmap;
    private List<PickerWorkloadResponse> pickerWorkload;
    private List<StockConfidenceResponse> stockConfidence;
    private List<ShipmentRiskResponse> shipmentRisk;
}
