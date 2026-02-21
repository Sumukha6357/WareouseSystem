package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ShipmentMetricsResponse {
    private long totalShipments;
    private long shipmentsInTransit;
    private long deliveredToday;
    private long failedShipments;
}
