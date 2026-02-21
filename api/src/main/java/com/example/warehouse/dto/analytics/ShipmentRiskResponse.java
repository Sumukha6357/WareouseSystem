package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ShipmentRiskResponse {
    private String shipmentId;
    private String trackingNumber;
    private String riskLevel; // LOW, MEDIUM, CRITICAL
    private Double probabilityOfDelay;
    private String detectedIssue;
}
