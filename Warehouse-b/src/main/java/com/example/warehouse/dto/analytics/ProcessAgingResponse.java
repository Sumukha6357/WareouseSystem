package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ProcessAgingResponse {
    private String orderId;
    private String orderNumber;
    private String status;
    private Long hoursInState;
}
