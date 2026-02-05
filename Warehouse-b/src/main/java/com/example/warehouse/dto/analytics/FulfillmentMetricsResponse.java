package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class FulfillmentMetricsResponse {
    private Integer avgPickTimeMinutes;
    private Integer avgPackTimeMinutes;
    private Integer avgDispatchTimeMinutes;
    private Integer avgTotalFulfillmentTimeMinutes;
}
