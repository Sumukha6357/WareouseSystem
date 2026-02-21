package com.example.warehouse.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Inventory response payload")
public class InventoryResponse {
    @Schema(example = "1de59d85-7f60-4548-b20a-cc9f3c73afec")
    private String inventoryId;
    private ProductResponse product;
    @Schema(example = "bf5a0a76-3f7e-4764-a987-40d7d8fdd920")
    private String blockId;
    @Schema(example = "Room A1")
    private String blockName;
    @Schema(example = "120")
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
