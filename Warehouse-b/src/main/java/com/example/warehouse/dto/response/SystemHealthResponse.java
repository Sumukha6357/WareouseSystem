package com.example.warehouse.dto.response;

import lombok.Data;

@Data
public class SystemHealthResponse {
    private double apiLatencyMs;
    private int webSocketSessions;
    private long lastInventorySyncTime;
    private int stuckOrdersCount;
    private String systemStatus; // "OPTIMAL", "STRESSED", "CRITICAL"
}
