package com.example.warehouse.service.implementation;

import com.example.warehouse.dto.analytics.*;
import com.example.warehouse.entity.*;
import com.example.warehouse.repository.*;
import com.example.warehouse.service.contract.AnalyticsService;
import org.springframework.stereotype.Service;
import com.example.warehouse.repository.UserRepository;
import com.example.warehouse.repository.PickTaskRepository;

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
    private final PickTaskRepository pickTaskRepository;
    private final UserRepository userRepository;

    public AnalyticsServiceImpl(ProductRepository productRepository,
            BlockRepository blockRepository,
            ShipmentRepository shipmentRepository,
            OrderRepository orderRepository,
            InventoryRepository inventoryRepository,
            PickTaskRepository pickTaskRepository,
            UserRepository userRepository) {
        this.productRepository = productRepository;
        this.blockRepository = blockRepository;
        this.shipmentRepository = shipmentRepository;
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.pickTaskRepository = pickTaskRepository;
        this.userRepository = userRepository;
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
                        .limit(5).collect(Collectors.toList()),
                getAgingInventory(),
                getStuckOrders(),
                getPickHeatmap(),
                getPickerWorkload(),
                getStockConfidence(),
                getShipmentRisk());
    }

    private List<InventoryAgingResponse> getAgingInventory() {
        return inventoryRepository.findAll().stream()
                .map(inv -> {
                    long days = Duration.between(inv.getCreatedAt(), java.time.Instant.now()).toDays();
                    return new InventoryAgingResponse(
                            inv.getInventoryId(),
                            inv.getProduct().getName(),
                            inv.getBlock().getName(),
                            inv.getQuantity(),
                            days);
                })
                .sorted((a, b) -> Long.compare(b.getDaysInWarehouse(), a.getDaysInWarehouse()))
                .limit(7)
                .collect(Collectors.toList());
    }

    private List<ProcessAgingResponse> getStuckOrders() {
        return orderRepository.findAll().stream()
                .filter(order -> order.getStatus() != OrderStatus.DISPATCHED
                        && order.getStatus() != OrderStatus.CANCELLED)
                .map(order -> {
                    double hours = Duration.between(order.getCreatedAt(), java.time.Instant.now()).toMinutes() / 60.0;
                    return new ProcessAgingResponse(
                            order.getOrderId(),
                            order.getOrderNumber(),
                            order.getStatus().toString(),
                            hours);
                })
                .sorted((a, b) -> Double.compare(b.getHoursInState(), a.getHoursInState()))
                .limit(7)
                .collect(Collectors.toList());
    }

    @Override
    public List<PickHeatmapResponse> getPickHeatmap() {
        // 1. Get all active tasks
        List<PickTask> activeTasks = pickTaskRepository.findAll().stream()
                .filter(t -> t.getStatus() == PickTaskStatus.ASSIGNED || t.getStatus() == PickTaskStatus.IN_PROGRESS)
                .collect(Collectors.toList());

        // 2. Group by Block ID
        java.util.Map<String, Long> tasksPerBlock = activeTasks.stream()
                .filter(t -> t.getBlock() != null)
                .collect(Collectors.groupingBy(t -> t.getBlock().getBlockId(), Collectors.counting()));

        // 3. Map to Response
        List<Block> allBlocks = blockRepository.findAll();
        return allBlocks.stream()
                .map(block -> {
                    long count = tasksPerBlock.getOrDefault(block.getBlockId(), 0L);
                    String congestion = "LOW";
                    if (count > 5)
                        congestion = "CRITICAL";
                    else if (count > 3)
                        congestion = "HIGH";
                    else if (count > 1)
                        congestion = "MEDIUM";

                    // Only return if there is activity to reduce noise, or return all?
                    // Let's return only active ones to keep payload small, frontend can overlay on
                    // map
                    return new PickHeatmapResponse(block.getBlockId(), block.getName(), count, congestion);
                })
                .filter(r -> r.getActivePicksCount() > 0)
                .collect(Collectors.toList());
    }

    @Override
    public List<PickerWorkloadResponse> getPickerWorkload() {
        List<User> pickers = userRepository.findAll().stream()
                .filter(u -> u.getUserRole() == com.example.warehouse.enums.UserRole.STAFF)
                .collect(Collectors.toList());

        return pickers.stream().map(user -> {
            List<PickTask> tasks = pickTaskRepository.findByAssignedToOrderByCreatedAtDesc(user.getUsername());

            long active = tasks.stream()
                    .filter(t -> t.getStatus() == PickTaskStatus.ASSIGNED
                            || t.getStatus() == PickTaskStatus.IN_PROGRESS)
                    .count();

            long completedToday = tasks.stream()
                    .filter(t -> t.getStatus() == PickTaskStatus.COMPLETED &&
                            t.getCompletedAt() != null &&
                            t.getCompletedAt().atZone(ZoneId.systemDefault()).toLocalDate().equals(LocalDate.now()))
                    .count();

            String status = "IDLE";
            if (active > 10)
                status = "OVERLOADED";
            else if (active > 0)
                status = "ACTIVE";

            return new PickerWorkloadResponse(user.getUsername(), active, completedToday, status);
        }).collect(Collectors.toList());
    }

    @Override
    public List<StockConfidenceResponse> getStockConfidence() {
        // Logic: Calculate confidence based on "Time since last movement/creation".
        // The older the stock without verification, the lower the confidence.
        // We use lastModifiedAt as a proxy for verification or movement.
        return inventoryRepository.findAll().stream()
                .map(inv -> {
                    long daysSinceLastTouch = Duration.between(inv.getLastModifiedAt(), java.time.Instant.now())
                            .toDays();
                    double score = 100.0;
                    String level = "HIGH";
                    String reason = "Recently Updated";

                    if (daysSinceLastTouch > 90) {
                        score = 40.0;
                        level = "LOW";
                        reason = "No movement > 90 days. Audit Recommended.";
                    } else if (daysSinceLastTouch > 30) {
                        score = 75.0;
                        level = "MEDIUM";
                        reason = "Stable stock (> 30 days).";
                    }

                    // Lower score if quantity is exactly 0 (ghost stock) or extremely high
                    // anomalies
                    if (inv.getQuantity() == 0) {
                        score = 10.0;
                        level = "LOW";
                        reason = "Phantom Stock (Qty 0).";
                    }

                    return new StockConfidenceResponse(
                            inv.getProduct().getProductId(),
                            inv.getProduct().getName(),
                            score,
                            level,
                            reason);
                })
                .sorted((a, b) -> Double.compare(a.getConfidenceScore(), b.getConfidenceScore())) // Lowest confidence
                                                                                                  // first
                .limit(5)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShipmentRiskResponse> getShipmentRisk() {
        // Logic: Identify shipments that are IN_TRANSIT but effectively "Stuck" or
        // late.
        return shipmentRepository.findAll().stream()
                .filter(s -> s.getStatus() == ShipmentStatus.IN_TRANSIT)
                .map(s -> {
                    long daysInTransit = 0;
                    if (s.getDispatchedAt() != null) {
                        daysInTransit = Duration.between(s.getDispatchedAt(), java.time.Instant.now()).toDays();
                    }

                    String risk = "LOW";
                    double probate = 0.1;
                    String issue = "On Track";

                    if (daysInTransit > 7) {
                        risk = "CRITICAL";
                        probate = 0.95;
                        issue = "Excessive Transit Time (> 7 days). Possibly Lost.";
                    } else if (daysInTransit > 3) {
                        risk = "MEDIUM";
                        probate = 0.45;
                        issue = "Delayed Transit (> 3 days).";
                    }

                    return new ShipmentRiskResponse(
                            s.getShipmentId(),
                            s.getTrackingNumber() != null ? s.getTrackingNumber() : s.getShipmentCode(),
                            risk,
                            probate,
                            issue);
                })
                .filter(r -> !r.getRiskLevel().equals("LOW")) // Only return risky ones
                .sorted((a, b) -> Double.compare(b.getProbabilityOfDelay(), a.getProbabilityOfDelay()))
                .limit(5)
                .collect(Collectors.toList());
    }
}
