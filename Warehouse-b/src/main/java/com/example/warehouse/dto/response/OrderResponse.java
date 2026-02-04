package com.example.warehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private String orderId;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String shippingAddress;
    private String status;
    private Integer totalItems;
    private String notes;
    private List<PickTaskResponse> pickTasks;
    private Long createdAt;
    private Long lastModifiedAt;
    private Long pickedAt;
    private Long packedAt;
    private Long dispatchedAt;
}
