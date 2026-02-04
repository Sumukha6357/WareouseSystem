package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentMetricsResponse {
    private Long totalShipments;
    private Long shipmentsInTransit;
    private Long deliveredToday;
    private Long failedShipments;
}
