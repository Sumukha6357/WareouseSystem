package com.example.warehouse.dto.analytics;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockUtilizationResponse {
    private String blockId;
    private String blockName;
    private Double occupancyPercentage;
    private String utilizationLevel; // HIGH, MEDIUM, LOW
}
