package com.example.warehouse.service.contract;

import com.example.warehouse.dto.analytics.*;

import java.util.List;

public interface AnalyticsService {
    List<StockTurnoverResponse> getStockTurnover();

    List<BlockUtilizationResponse> getBlockUtilization();

    FulfillmentMetricsResponse getFulfillmentMetrics();

    ShipmentMetricsResponse getShipmentMetrics();

    DashboardSummaryResponse getDashboardSummary();
}
