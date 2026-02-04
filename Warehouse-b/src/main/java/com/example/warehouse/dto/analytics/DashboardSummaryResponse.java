package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private ShipmentMetricsResponse shipmentMetrics;
    private FulfillmentMetricsResponse fulfillmentMetrics;
    private List<StockTurnoverResponse> topMovers;
    private List<BlockUtilizationResponse> highUtilizationBlocks;
}
