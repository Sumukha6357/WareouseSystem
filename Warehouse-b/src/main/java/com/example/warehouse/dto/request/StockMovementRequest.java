package com.example.warehouse.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockMovementRequest {
    private String productId;
    private String fromBlockId;
    private String toBlockId;
    private Integer quantity;
    private String movementType; // INBOUND, PUTAWAY, PICK, TRANSFER, ADJUSTMENT, OUTBOUND
    private String referenceType; // PO, SO, TRANSFER, ADJUSTMENT
    private String referenceId;
    private String notes;
}
