package com.example.warehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockMovementResponse {
    private String movementId;
    private ProductResponse product;
    private String fromBlockId;
    private String fromBlockName;
    private String toBlockId;
    private String toBlockName;
    private Integer quantity;
    private String movementType;
    private String referenceType;
    private String referenceId;
    private String notes;
    private String createdBy;
    private Long createdAt;
}
