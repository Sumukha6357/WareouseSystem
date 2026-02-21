package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class StockConfidenceResponse {
    private String productId;
    private String productName;
    private Integer confidenceScore;
    private String confidenceLevel; // HIGH, MEDIUM, LOW
    private String reason;
}
