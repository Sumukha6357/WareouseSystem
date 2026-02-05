package com.example.warehouse.controller;

import com.example.warehouse.dto.analytics.*;
import com.example.warehouse.service.contract.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@org.springframework.web.bind.annotation.CrossOrigin("*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<Map<String, DashboardSummaryResponse>> getDashboardSummary() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getDashboardSummary()));
    }

    @GetMapping("/stock-turnover")
    public ResponseEntity<Map<String, List<StockTurnoverResponse>>> getStockTurnover() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getStockTurnover()));
    }

    @GetMapping("/block-utilization")
    public ResponseEntity<Map<String, List<BlockUtilizationResponse>>> getBlockUtilization() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getBlockUtilization()));
    }

    @GetMapping("/fulfillment-metrics")
    public ResponseEntity<Map<String, FulfillmentMetricsResponse>> getFulfillmentMetrics() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getFulfillmentMetrics()));
    }

    @GetMapping("/shipment-metrics")
    public ResponseEntity<Map<String, ShipmentMetricsResponse>> getShipmentMetrics() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getShipmentMetrics()));
    }

    @GetMapping("/pick-heatmap")
    public ResponseEntity<Map<String, List<PickHeatmapResponse>>> getPickHeatmap() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getPickHeatmap()));
    }

    @GetMapping("/picker-workload")
    public ResponseEntity<Map<String, List<PickerWorkloadResponse>>> getPickerWorkload() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getPickerWorkload()));
    }

    @GetMapping("/stock-confidence")
    public ResponseEntity<Map<String, List<StockConfidenceResponse>>> getStockConfidence() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getStockConfidence()));
    }

    @GetMapping("/shipment-risk")
    public ResponseEntity<Map<String, List<ShipmentRiskResponse>>> getShipmentRisk() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getShipmentRisk()));
    }
}
