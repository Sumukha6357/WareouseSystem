package com.example.warehouse.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PickerWorkloadResponse {
    private String username;
    private long activeTaskCount;
    private long completedTodayCount;
    private String status; // IDLE, ACTIVE, OVERLOADED
}
