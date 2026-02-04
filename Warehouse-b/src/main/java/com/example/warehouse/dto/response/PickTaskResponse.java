package com.example.warehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PickTaskResponse {
    private String taskId;
    private String orderId;
    private String orderNumber;
    private ProductResponse product;
    private String blockId;
    private String blockName;
    private Integer quantity;
    private String assignedTo;
    private String status;
    private String notes;
    private Long createdAt;
    private Long lastModifiedAt;
    private Long completedAt;
}
