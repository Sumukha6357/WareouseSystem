package com.example.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request payload to create or update inventory in a block")
public class InventoryRequest {
    @Schema(example = "a8b6d4f1-9f7b-4ab5-a668-cf1cb4f0e2d2")
    @NotBlank
    private String productId;
    @Schema(example = "bf5a0a76-3f7e-4764-a987-40d7d8fdd920")
    @NotBlank
    private String blockId;
    @Schema(example = "120")
    @NotNull
    @Positive
    private Integer quantity;
    @Schema(example = "20")
    @NotNull
    @Positive
    private Integer minStockLevel;
    @Schema(example = "500")
    @NotNull
    @Positive
    private Integer maxStockLevel;
}
