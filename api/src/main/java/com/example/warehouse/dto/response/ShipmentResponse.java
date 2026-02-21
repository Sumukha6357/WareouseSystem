package com.example.warehouse.dto.response;

import com.example.warehouse.entity.ShipmentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@Schema(description = "Shipment response payload")
public class ShipmentResponse {
    @Schema(example = "f151db74-d850-495d-97b3-e9ef4b47bbf1")
    private String shipmentId;
    @Schema(example = "SHP-2026-0001")
    private String shipmentCode;
    @Schema(example = "5a5f96aa-aa39-41e5-a689-950a23f1f0aa")
    private String orderId;
    @Schema(example = "c6ef92c7-7791-4221-b4f5-a5eb6c8d7547")
    private String shipperId;
    @Schema(example = "QuickLine Logistics")
    private String shipperName;
    @Schema(example = "f365303f-c963-4f9f-8854-805f6e7f7b3e")
    private String warehouseId;
    @Schema(example = "DISPATCHED")
    private ShipmentStatus status;
    @Schema(example = "TRK-7B4A21FF")
    private String trackingNumber;
    private Instant createdAt;
    private Instant dispatchedAt;
    private Instant deliveredAt;
}
