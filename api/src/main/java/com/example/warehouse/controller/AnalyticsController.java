package com.example.warehouse.controller;

import com.example.warehouse.dto.analytics.*;
import com.example.warehouse.dto.wrapper.PageResponse;
import com.example.warehouse.service.contract.AnalyticsService;
import com.example.warehouse.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard-summary")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, DashboardSummaryResponse>> getDashboardSummary() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getDashboardSummary()));
    }

    @GetMapping("/stock-turnover")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, List<StockTurnoverResponse>>> getStockTurnover() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getStockTurnover()));
    }

    @GetMapping(value = "/stock-turnover", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, PageResponse<StockTurnoverResponse>>> getStockTurnoverPaged(Pageable pageable) {
        return ResponseEntity.ok(Map.of("data",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getStockTurnover(), pageable))));
    }

    @GetMapping("/block-utilization")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, List<BlockUtilizationResponse>>> getBlockUtilization() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getBlockUtilization()));
    }

    @GetMapping(value = "/block-utilization", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, PageResponse<BlockUtilizationResponse>>> getBlockUtilizationPaged(
            Pageable pageable) {
        return ResponseEntity.ok(Map.of("data",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getBlockUtilization(), pageable))));
    }

    @GetMapping("/fulfillment-metrics")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, FulfillmentMetricsResponse>> getFulfillmentMetrics() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getFulfillmentMetrics()));
    }

    @GetMapping("/shipment-metrics")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, ShipmentMetricsResponse>> getShipmentMetrics() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getShipmentMetrics()));
    }

    @GetMapping("/pick-heatmap")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, List<PickHeatmapResponse>>> getPickHeatmap() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getPickHeatmap()));
    }

    @GetMapping(value = "/pick-heatmap", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, PageResponse<PickHeatmapResponse>>> getPickHeatmapPaged(Pageable pageable) {
        return ResponseEntity.ok(Map.of("data",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getPickHeatmap(), pageable))));
    }

    @GetMapping("/picker-workload")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, List<PickerWorkloadResponse>>> getPickerWorkload() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getPickerWorkload()));
    }

    @GetMapping(value = "/picker-workload", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, PageResponse<PickerWorkloadResponse>>> getPickerWorkloadPaged(Pageable pageable) {
        return ResponseEntity.ok(Map.of("data",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getPickerWorkload(), pageable))));
    }

    @GetMapping("/stock-confidence")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, List<StockConfidenceResponse>>> getStockConfidence() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getStockConfidence()));
    }

    @GetMapping(value = "/stock-confidence", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, PageResponse<StockConfidenceResponse>>> getStockConfidencePaged(
            Pageable pageable) {
        return ResponseEntity.ok(Map.of("data",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getStockConfidence(), pageable))));
    }

    @GetMapping("/shipment-risk")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, List<ShipmentRiskResponse>>> getShipmentRisk() {
        return ResponseEntity.ok(Map.of("data", analyticsService.getShipmentRisk()));
    }

    @GetMapping(value = "/shipment-risk", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<Map<String, PageResponse<ShipmentRiskResponse>>> getShipmentRiskPaged(Pageable pageable) {
        return ResponseEntity.ok(Map.of("data",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getShipmentRisk(), pageable))));
    }
}
