package com.example.warehouse.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PickTaskAssignmentRequest {
    private String orderId;
    private String assignedTo; // Username of picker
}
