package com.example.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request payload for creating/updating product metadata")
public class ProductRequest {
    @Schema(example = "Premium Tape")
    @NotBlank
    @Size(max = 120)
    private String name;
    @Schema(example = "Industrial packaging tape")
    @Size(max = 500)
    private String description;
    @Schema(example = "TAPE-PRM-001")
    @NotBlank
    @Size(max = 64)
    private String sku;
    @Schema(example = "Packaging")
    @NotBlank
    @Size(max = 64)
    private String category;
    @Schema(example = "9.99")
    @NotNull
    @Positive
    private Double unitPrice;
    @Schema(example = "0.25")
    @NotNull
    @Positive
    private Double weight;
    @Schema(example = "10x5x2 cm")
    @NotBlank
    @Size(max = 120)
    private String dimensions;
}
