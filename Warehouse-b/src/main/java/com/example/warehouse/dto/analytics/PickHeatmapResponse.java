package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class PickHeatmapResponse {
    private String blockId;
    private String blockName;
    private Long activePicksCount;
    private String congestionLevel; // LOW, MEDIUM, HIGH, CRITICAL
}
