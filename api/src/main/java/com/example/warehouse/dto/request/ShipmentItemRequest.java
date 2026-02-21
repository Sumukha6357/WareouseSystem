package com.example.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ShipmentItemRequest {
    @NotBlank
    private String productId;
    @NotBlank
    private String blockId;
    @NotNull
    @Positive
    private Integer quantity;
}
