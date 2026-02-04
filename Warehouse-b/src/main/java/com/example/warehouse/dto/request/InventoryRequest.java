package com.example.warehouse.dto.request;

import lombok.Data;

@Data
public class InventoryRequest {
    private String productId;
    private String blockId;
    private Integer quantity;
    private Integer minStockLevel;
    private Integer maxStockLevel;
}
