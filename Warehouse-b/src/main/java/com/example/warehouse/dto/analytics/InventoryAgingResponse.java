package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class InventoryAgingResponse {
    private String inventoryId;
    private String productName;
    private String blockName;
    private Integer quantity;
    private Long daysInWarehouse;
}
