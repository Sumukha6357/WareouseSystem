package com.example.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockMovementRequest {
    @NotBlank
    private String productId;
    private String fromBlockId;
    private String toBlockId;
    @NotNull
    @Positive
    private Integer quantity;
    @NotBlank
    @Size(max = 32)
    private String movementType; // INBOUND, PUTAWAY, PICK, TRANSFER, ADJUSTMENT, OUTBOUND
    @Size(max = 32)
    private String referenceType; // PO, SO, TRANSFER, ADJUSTMENT
    @Size(max = 64)
    private String referenceId;
    @Size(max = 500)
    private String notes;
}
