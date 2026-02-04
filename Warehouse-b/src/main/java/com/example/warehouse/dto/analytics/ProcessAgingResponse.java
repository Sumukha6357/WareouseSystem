package com.example.warehouse.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcessAgingResponse {
    private String orderId;
    private String orderNumber;
    private String status;
    private double hoursInState;
}
