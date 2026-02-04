package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockTurnoverResponse {
    private String productId;
    private String productName;
    private Long totalMovements;
    private Double turnoverRate; // Turnover rate = Total COGS / Average Inventory (Simplified here)
}
