package com.example.warehouse.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.List;

@Data
@Schema(description = "Request payload for creating a shipment")
public class CreateShipmentRequest {
    @Schema(example = "5a5f96aa-aa39-41e5-a689-950a23f1f0aa")
    @NotBlank
    private String orderId;
    @Schema(example = "c6ef92c7-7791-4221-b4f5-a5eb6c8d7547")
    private String shipperId;
    @Schema(example = "f365303f-c963-4f9f-8854-805f6e7f7b3e")
    @NotBlank
    private String warehouseId;
    @Schema(example = "TRK-7B4A21FF")
    @Size(max = 128)
    private String trackingNumber;
    @ArraySchema(schema = @Schema(implementation = ShipmentItemRequest.class))
    @Valid
    private List<ShipmentItemRequest> items;
}
