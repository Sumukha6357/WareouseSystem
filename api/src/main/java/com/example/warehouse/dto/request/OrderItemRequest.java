package com.example.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Order line item")
public class OrderItemRequest {
    @Schema(example = "a8b6d4f1-9f7b-4ab5-a668-cf1cb4f0e2d2")
    @NotBlank
    private String productId;
    @Schema(example = "12")
    @NotNull
    @Positive
    private Integer quantity;
}
