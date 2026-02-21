package com.example.warehouse.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Request payload for creating a sales order")
public class OrderRequest {
    @Schema(example = "SO-2026-0001")
    @NotBlank
    @Size(max = 64)
    private String orderNumber;
    @Schema(example = "Acme Retail")
    @NotBlank
    @Size(max = 120)
    private String customerName;
    @Schema(example = "ops@acme-retail.com")
    @NotBlank
    @Email
    @Size(max = 255)
    private String customerEmail;
    @Schema(example = "21 Industrial Ave, Austin, TX")
    @NotBlank
    @Size(max = 500)
    private String shippingAddress;
    @Schema(example = "Fragile items, handle with care")
    @Size(max = 500)
    private String notes;
    @ArraySchema(schema = @Schema(implementation = OrderItemRequest.class))
    @NotNull
    @Size(min = 1)
    @Valid
    private List<OrderItemRequest> items;
}
