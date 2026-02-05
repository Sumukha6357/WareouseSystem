package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class BlockUtilizationResponse {
    private String blockId;
    private String blockName;
    private Double occupancyPercentage;
    private String utilizationLevel;
}
