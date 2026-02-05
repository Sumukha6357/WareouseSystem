package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockTurnoverResponse {
    private String productId;
    private String productName;
    private Long totalMovements;
    private Double turnoverRate;
}
