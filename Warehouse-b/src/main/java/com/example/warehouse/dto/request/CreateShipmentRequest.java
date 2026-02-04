package com.example.warehouse.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class CreateShipmentRequest {
    private String orderId;
    private String shipperId;
    private String warehouseId;
    private String trackingNumber;
    private List<ShipmentItemRequest> items;
}
