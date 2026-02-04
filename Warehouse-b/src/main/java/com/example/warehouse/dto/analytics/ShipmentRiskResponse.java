package com.example.warehouse.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShipmentRiskResponse {
    private String shipmentId;
    private String trackingNumber;
    private String riskLevel; // LOW, MEDIUM, CRITICAL
    private double probabilityOfDelay; // 0.0 to 1.0
    private String detectedIssue; // e.g. "Stuck at Customs", "Weather Delay", "Late Departure"
}
