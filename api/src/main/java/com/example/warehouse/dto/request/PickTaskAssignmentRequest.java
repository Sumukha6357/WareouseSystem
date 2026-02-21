package com.example.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PickTaskAssignmentRequest {
    @NotBlank
    private String orderId;
    @NotBlank
    private String assignedTo; // Username of picker
}
