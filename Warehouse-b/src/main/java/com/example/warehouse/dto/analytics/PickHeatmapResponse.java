package com.example.warehouse.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PickHeatmapResponse {
    private String blockId;
    private String blockName;
    private long activePicksCount;
    private String congestionLevel; // LOW, MEDIUM, HIGH, CRITICAL
}
