package com.example.warehouse.service.implementation;

import com.example.warehouse.dto.analytics.*;
import com.example.warehouse.entity.*;
import com.example.warehouse.repository.*;
import com.example.warehouse.service.contract.AnalyticsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.Duration;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ProductRepository productRepository;
    private final BlockRepository blockRepository;
    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;

    public AnalyticsServiceImpl(ProductRepository productRepository,
            BlockRepository blockRepository,
            ShipmentRepository shipmentRepository,
            OrderRepository orderRepository,
            InventoryRepository inventoryRepository) {
        this.productRepository = productRepository;
        this.blockRepository = blockRepository;
        this.shipmentRepository = shipmentRepository;
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    public List<StockTurnoverResponse> getStockTurnover() {
        // Simplified Logic:
        // 1. Get all products
        // 2. Count "movements" (proxied by shipment items or order items in past 30
        // days)
        // 3. Turnover Rate = Sales / Avg Inventory (here simplified to just total
        // movements count)

        // This would ideally require a more complex StockMovement history query
        return productRepository.findAll().stream()
                .map(product -> {
                    // Placeholder for complex query
                    long movements = (long) (Math.random() * 100);
                    return new StockTurnoverResponse(product.getProductId(), product.getName(), movements,
                            movements / 10.0);
                })
                .sorted((a, b) -> Long.compare(b.getTotalMovements(), a.getTotalMovements()))
                .collect(Collectors.toList());
    }

    @Override
    public List<BlockUtilizationResponse> getBlockUtilization() {
        List<Block> blocks = blockRepository.findAll();
        List<BlockUtilizationResponse> responses = new ArrayList<>();

        for (Block block : blocks) {
            // Utilization = (occupied volume / total capacity) * 100
            // Assuming simplified utilization based on simplified inventory counts vs
            // arbitrary capacity

            // Getting inventory items in this block
            List<Inventory> inventoryList = inventoryRepository.findByBlockBlockId(block.getBlockId());
            double currentVolume = inventoryList.stream()
                    .mapToDouble(inv -> inv.getQuantity() * inv.getProduct().getVolume())
                    .sum();

            double capacity = block.getTotalCapacity();
            double occupancyPercentage = (capacity > 0) ? (currentVolume / capacity) * 100 : 0.0;

            String utilizationLevel = "LOW";
            if (occupancyPercentage > 80)
                utilizationLevel = "HIGH";
            else if (occupancyPercentage > 50)
                utilizationLevel = "MEDIUM";

            responses.add(new BlockUtilizationResponse(
                    block.getBlockId(),
                    block.getName(),
                    occupancyPercentage,
                    utilizationLevel));
        }
        return responses;
    }

    @Override
    public FulfillmentMetricsResponse getFulfillmentMetrics() {
        List<Order> orders = orderRepository.findAll();

        long totalPickSeconds = 0;
        long totalPackSeconds = 0;
        long totalDispatchSeconds = 0;
        long totalFulfillmentSeconds = 0;
        int count = 0;

        for (Order order : orders) {
            if (order.getStatus() == OrderStatus.DISPATCHED) {
                if (order.getCreatedAt() != null && order.getPickedAt() != null) {
                    totalPickSeconds += Duration.between(order.getCreatedAt(), order.getPickedAt()).getSeconds();
                }
                if (order.getPickedAt() != null && order.getPackedAt() != null) {
                    totalPackSeconds += Duration.between(order.getPickedAt(), order.getPackedAt()).getSeconds();
                }
                if (order.getPackedAt() != null && order.getDispatchedAt() != null) {
                    totalDispatchSeconds += Duration.between(order.getPackedAt(), order.getDispatchedAt()).getSeconds();
                }
                if (order.getCreatedAt() != null && order.getDispatchedAt() != null) {
                    totalFulfillmentSeconds += Duration.between(order.getCreatedAt(), order.getDispatchedAt())
                            .getSeconds();
                }
                count++;
            }
        }

        double avgPick = count > 0 ? (totalPickSeconds / 60.0) / count : 0;
        double avgPack = count > 0 ? (totalPackSeconds / 60.0) / count : 0;
        double avgDispatch = count > 0 ? (totalDispatchSeconds / 60.0) / count : 0;
        double avgTotal = count > 0 ? (totalFulfillmentSeconds / 60.0) / count : 0;

        return new FulfillmentMetricsResponse(avgPick, avgPack, avgDispatch, avgTotal);
    }

    @Override
    public ShipmentMetricsResponse getShipmentMetrics() {
        // Ideally should filter by date/today
        List<Shipment> allShipments = shipmentRepository.findAll();

        long total = allShipments.size();
        long inTransit = allShipments.stream()
                .filter(s -> s.getStatus() == ShipmentStatus.IN_TRANSIT || s.getStatus() == ShipmentStatus.DISPATCHED)
                .count();

        // Delivered today
        LocalDate today = LocalDate.now();
        long deliveredToday = allShipments.stream()
                .filter(s -> s.getStatus() == ShipmentStatus.DELIVERED)
                .filter(s -> s.getDeliveredAt() != null &&
                        s.getDeliveredAt().atZone(ZoneId.systemDefault()).toLocalDate().equals(today))
                .count();

        long failed = allShipments.stream()
                .filter(s -> s.getStatus() == ShipmentStatus.FAILED || s.getStatus() == ShipmentStatus.RETURNED)
                .count();

        return new ShipmentMetricsResponse(total, inTransit, deliveredToday, failed);
    }

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        return new DashboardSummaryResponse(
                getShipmentMetrics(),
                getFulfillmentMetrics(),
                getStockTurnover().stream().limit(5).collect(Collectors.toList()),
                getBlockUtilization().stream()
                        .filter(b -> b.getOccupancyPercentage() > 80)
                        .limit(5).collect(Collectors.toList()));
    }
}
