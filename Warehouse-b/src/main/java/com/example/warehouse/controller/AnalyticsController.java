package com.example.warehouse.controller;

import com.example.warehouse.dto.analytics.*;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.AnalyticsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/stock-turnover")
    public ResponseEntity<ResponseStructure<List<StockTurnoverResponse>>> getStockTurnover() {
        List<StockTurnoverResponse> data = analyticsService.getStockTurnover();
        return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(), "Stock turnover metrics data", data));
    }

    @GetMapping("/block-utilization")
    public ResponseEntity<ResponseStructure<List<BlockUtilizationResponse>>> getBlockUtilization() {
        List<BlockUtilizationResponse> data = analyticsService.getBlockUtilization();
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Block utilization metrics data", data));
    }

    @GetMapping("/fulfillment-metrics")
    public ResponseEntity<ResponseStructure<FulfillmentMetricsResponse>> getFulfillmentMetrics() {
        FulfillmentMetricsResponse data = analyticsService.getFulfillmentMetrics();
        return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(), "Fulfillment metrics data", data));
    }

    @GetMapping("/shipment-metrics")
    public ResponseEntity<ResponseStructure<ShipmentMetricsResponse>> getShipmentMetrics() {
        ShipmentMetricsResponse data = analyticsService.getShipmentMetrics();
        return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipment metrics data", data));
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<ResponseStructure<DashboardSummaryResponse>> getDashboardSummary() {
        DashboardSummaryResponse data = analyticsService.getDashboardSummary();
        return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(), "Dashboard summary data", data));
    }
}
