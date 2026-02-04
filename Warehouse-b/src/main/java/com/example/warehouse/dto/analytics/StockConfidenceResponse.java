package com.example.warehouse.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockConfidenceResponse {
    private String productId;
    private String productName;
    private double confidenceScore; // 0.0 to 100.0
    private String confidenceLevel; // HIGH, MEDIUM, LOW
    private String reason; // e.g. "Recently Audited", "No movement in 90 days"
}
