package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class PickerWorkloadResponse {
    private String username;
    private Long activeTaskCount;
    private Long completedTodayCount;
    private String status; // IDLE, ACTIVE, OVERLOADED
}
