package com.example.warehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryResponse {
    private String inventoryId;
    private ProductResponse product;
    private String blockId;
    private String blockName;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer damagedQuantity;
    private Integer availableQuantity;
    private Integer minStockLevel;
    private Integer maxStockLevel;
    private Boolean isLowStock;
    private Long createdAt;
    private Long lastModifiedAt;
}
