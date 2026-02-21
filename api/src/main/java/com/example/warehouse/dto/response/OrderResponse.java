package com.example.warehouse.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Order response payload")
public class OrderResponse {
    @Schema(example = "5a5f96aa-aa39-41e5-a689-950a23f1f0aa")
    private String orderId;
    @Schema(example = "SO-2026-0001")
    private String orderNumber;
    @Schema(example = "Acme Retail")
    private String customerName;
    @Schema(example = "ops@acme-retail.com")
    private String customerEmail;
    @Schema(example = "21 Industrial Ave, Austin, TX")
    private String shippingAddress;
    @Schema(example = "PENDING")
    private String status;
    @Schema(example = "12")
    private Integer totalItems;
    @Schema(example = "Fragile items, handle with care")
    private String notes;
    private List<PickTaskResponse> pickTasks;
    @Schema(example = "1739635200000")
    private Long createdAt;
    private Long lastModifiedAt;
    private Long pickedAt;
    private Long packedAt;
    private Long dispatchedAt;
}
