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

import com.example.warehouse.dto.wrapper.ResponseStructure;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard-summary")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<DashboardSummaryResponse>> getDashboardSummary() {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Dashboard summary retrieved",
                analyticsService.getDashboardSummary()));
    }

    @GetMapping("/stock-turnover")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<StockTurnoverResponse>>> getStockTurnover() {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Stock turnover retrieved",
                analyticsService.getStockTurnover()));
    }

    @GetMapping(value = "/stock-turnover", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<StockTurnoverResponse>>> getStockTurnoverPaged(
            Pageable pageable) {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Stock turnover retrieved",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getStockTurnover(), pageable))));
    }

    @GetMapping("/block-utilization")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<BlockUtilizationResponse>>> getBlockUtilization() {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Block utilization retrieved",
                analyticsService.getBlockUtilization()));
    }

    @GetMapping(value = "/block-utilization", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<BlockUtilizationResponse>>> getBlockUtilizationPaged(
            Pageable pageable) {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Block utilization retrieved",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getBlockUtilization(), pageable))));
    }

    @GetMapping("/fulfillment-metrics")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<FulfillmentMetricsResponse>> getFulfillmentMetrics() {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Fulfillment metrics retrieved",
                analyticsService.getFulfillmentMetrics()));
    }

    @GetMapping("/shipment-metrics")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<ShipmentMetricsResponse>> getShipmentMetrics() {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Shipment metrics retrieved",
                analyticsService.getShipmentMetrics()));
    }

    @GetMapping("/pick-heatmap")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<PickHeatmapResponse>>> getPickHeatmap() {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Pick heatmap retrieved",
                analyticsService.getPickHeatmap()));
    }

    @GetMapping(value = "/pick-heatmap", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<PickHeatmapResponse>>> getPickHeatmapPaged(Pageable pageable) {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Pick heatmap retrieved",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getPickHeatmap(), pageable))));
    }

    @GetMapping("/picker-workload")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<PickerWorkloadResponse>>> getPickerWorkload() {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Picker workload retrieved",
                analyticsService.getPickerWorkload()));
    }

    @GetMapping(value = "/picker-workload", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<PickerWorkloadResponse>>> getPickerWorkloadPaged(
            Pageable pageable) {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Picker workload retrieved",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getPickerWorkload(), pageable))));
    }

    @GetMapping("/stock-confidence")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<StockConfidenceResponse>>> getStockConfidence() {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Stock confidence retrieved",
                analyticsService.getStockConfidence()));
    }

    @GetMapping(value = "/stock-confidence", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<StockConfidenceResponse>>> getStockConfidencePaged(
            Pageable pageable) {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Stock confidence retrieved",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getStockConfidence(), pageable))));
    }

    @GetMapping("/shipment-risk")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<ShipmentRiskResponse>>> getShipmentRisk() {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Shipment risk retrieved",
                analyticsService.getShipmentRisk()));
    }

    @GetMapping(value = "/shipment-risk", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<ShipmentRiskResponse>>> getShipmentRiskPaged(
            Pageable pageable) {
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Shipment risk retrieved",
                PageUtils.toPageResponse(PageUtils.paginate(analyticsService.getShipmentRisk(), pageable))));
    }
}
