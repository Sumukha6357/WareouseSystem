package com.example.warehouse.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String shippingAddress;
    private String notes;
    private List<OrderItemRequest> items;
}
