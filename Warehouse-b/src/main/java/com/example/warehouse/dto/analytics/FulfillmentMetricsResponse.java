package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FulfillmentMetricsResponse {
    private Double avgPickTimeMinutes;
    private Double avgPackTimeMinutes;
    private Double avgDispatchTimeMinutes;
    private Double avgTotalFulfillmentTimeMinutes;
}
