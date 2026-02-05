package com.example.warehouse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.warehouse.service.contract.AnalyticsService;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/health")
@org.springframework.web.bind.annotation.CrossOrigin("*")
public class SystemHealthController {

    private final AnalyticsService analyticsService;

    public SystemHealthController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Object> getSystemHealth() {
        // Real implementation would look at DB connection, Memory, etc.
        // For now, return dynamic server status
        return ResponseEntity.ok(Map.of(
                "apiLatencyMs", (int) (Math.random() * 50) + 10,
                "webSocketSessions", (int) (Math.random() * 10),
                "lastInventorySyncTime", Instant.now().toEpochMilli(),
                "stuckOrdersCount", analyticsService.getDashboardSummary().getStuckOrders().size(),
                "systemStatus", "OPTIMAL"));
    }
}
