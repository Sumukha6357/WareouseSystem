package com.example.warehouse.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Product response payload")
public class ProductResponse {
    @Schema(example = "a8b6d4f1-9f7b-4ab5-a668-cf1cb4f0e2d2")
    private String productId;
    @Schema(example = "Premium Tape")
    private String name;
    @Schema(example = "Industrial packaging tape")
    private String description;
    @Schema(example = "TAPE-PRM-001")
    private String sku;
    @Schema(example = "Packaging")
    private String category;
    @Schema(example = "9.99")
    private Double unitPrice;
    @Schema(example = "0.25")
    private Double weight;
    @Schema(example = "10x5x2 cm")
    private String dimensions;
    private Long createdAt;
    private Long lastModifiedAt;
}
