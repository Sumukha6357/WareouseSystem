package com.example.warehouse.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryAgingResponse {
    private String inventoryId;
    private String productName;
    private String blockName;
    private int quantity;
    private long daysInWarehouse;
}
