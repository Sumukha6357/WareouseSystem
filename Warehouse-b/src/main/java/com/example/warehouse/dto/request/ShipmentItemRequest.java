package com.example.warehouse.dto.request;

import lombok.Data;

@Data
public class ShipmentItemRequest {
    private String productId;
    private String blockId;
    private Integer quantity;
}
