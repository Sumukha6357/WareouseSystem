package com.example.warehouse.service.impl;

import com.example.warehouse.dto.analytics.*;
import com.example.warehouse.entity.*;
import com.example.warehouse.enums.UserRole;
import com.example.warehouse.repository.*;
import com.example.warehouse.service.contract.AnalyticsService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final BlockRepository blockRepository;
    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final PickTaskRepository pickTaskRepository;
    private final UserRepository userRepository;
    private final StockMovementRepository stockMovementRepository;

    public AnalyticsServiceImpl(BlockRepository blockRepository,
            ShipmentRepository shipmentRepository,
            OrderRepository orderRepository,
            InventoryRepository inventoryRepository,
            PickTaskRepository pickTaskRepository,
            UserRepository userRepository,
            StockMovementRepository stockMovementRepository) {
        this.blockRepository = blockRepository;
        this.shipmentRepository = shipmentRepository;
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.pickTaskRepository = pickTaskRepository;
        this.userRepository = userRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @Override
    public List<StockTurnoverResponse> getStockTurnover() {
        // Use the custom JPQL query for top movers
        return stockMovementRepository.findTopMovers().stream()
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    public List<BlockUtilizationResponse> getBlockUtilization() {
        List<Block> blocks = blockRepository.findAll();

        return blocks.stream().map(block -> {
            // Utilization = (occupied volume / total capacity) * 100
            List<Inventory> inventoryList = inventoryRepository.findByBlockBlockId(block.getBlockId());
            double currentVolume = inventoryList.stream()
                    .mapToDouble(inv -> inv.getQuantity() * inv.getProduct().getVolume())
                    .sum();

            double capacity = block.getTotalCapacity();
            double occupancyPercentage = (capacity > 0) ? (currentVolume / capacity) * 100 : 0.0;

            String utilizationLevel = "LOW";
            if (occupancyPercentage > 85)
                utilizationLevel = "CRITICAL";
            else if (occupancyPercentage > 70)
                utilizationLevel = "HIGH";
            else if (occupancyPercentage > 40)
                utilizationLevel = "MEDIUM";

            return BlockUtilizationResponse.builder()
                    .blockId(block.getBlockId())
                    .blockName(block.getName())
                    .occupancyPercentage(occupancyPercentage)
                    .utilizationLevel(utilizationLevel)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public FulfillmentMetricsResponse getFulfillmentMetrics() {
        List<Order> orders = orderRepository.findByStatusOrderByCreatedAtDesc(OrderStatus.DISPATCHED);

        long totalPickSeconds = 0;
        long totalPackSeconds = 0;
        long totalDispatchSeconds = 0;
        long totalFulfillmentSeconds = 0;
        int count = 0;

        for (Order order : orders) {
            if (order.getCreatedAt() != null && order.getPickedAt() != null) {
                totalPickSeconds += ChronoUnit.SECONDS.between(order.getCreatedAt(), order.getPickedAt());
            }
            if (order.getPickedAt() != null && order.getPackedAt() != null) {
                totalPackSeconds += ChronoUnit.SECONDS.between(order.getPickedAt(), order.getPackedAt());
            }
            if (order.getPackedAt() != null && order.getDispatchedAt() != null) {
                totalDispatchSeconds += ChronoUnit.SECONDS.between(order.getPackedAt(), order.getDispatchedAt());
            }
            if (order.getCreatedAt() != null && order.getDispatchedAt() != null) {
                totalFulfillmentSeconds += ChronoUnit.SECONDS.between(order.getCreatedAt(), order.getDispatchedAt());
            }
            count++;
        }

        int avgPick = count > 0 ? (int) (totalPickSeconds / 60 / count) : 0;
        int avgPack = count > 0 ? (int) (totalPackSeconds / 60 / count) : 0;
        int avgDispatch = count > 0 ? (int) (totalDispatchSeconds / 60 / count) : 0;
        int avgTotal = count > 0 ? (int) (totalFulfillmentSeconds / 60 / count) : 0;

        return FulfillmentMetricsResponse.builder()
                .avgPickTimeMinutes(avgPick)
                .avgPackTimeMinutes(avgPack)
                .avgDispatchTimeMinutes(avgDispatch)
                .avgTotalFulfillmentTimeMinutes(avgTotal)
                .build();
    }

    @Override
    public ShipmentMetricsResponse getShipmentMetrics() {
        long total = shipmentRepository.count();
        LocalDate today = LocalDate.now();
        Instant startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).minusNanos(1).toInstant();
        long deliveredToday = shipmentRepository.countByStatusAndDeliveredAtBetween(
                ShipmentStatus.DELIVERED,
                startOfDay,
                endOfDay);

        // Failed = FAILED or RETURNED
        long failed = shipmentRepository.countByStatusIn(List.of(ShipmentStatus.FAILED, ShipmentStatus.RETURNED));

        // In Transit = DISPATCHED or IN_TRANSIT
        long inTransit = shipmentRepository
                .countByStatusIn(List.of(ShipmentStatus.DISPATCHED, ShipmentStatus.IN_TRANSIT));

        return ShipmentMetricsResponse.builder()
                .totalShipments(total)
                .deliveredToday(deliveredToday)
                .shipmentsInTransit(inTransit)
                .failedShipments(failed)
                .build();
    }

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        return DashboardSummaryResponse.builder()
                .shipmentMetrics(getShipmentMetrics())
                .fulfillmentMetrics(getFulfillmentMetrics())
                .topMovers(getStockTurnover())
                .highUtilizationBlocks(getBlockUtilization().stream().filter(b -> b.getOccupancyPercentage() > 70)
                        .limit(5).collect(Collectors.toList()))
                .agingInventory(getAgingInventory())
                .stuckOrders(getStuckOrders())
                .pickHeatmap(getPickHeatmap())
                .pickerWorkload(getPickerWorkload())
                .stockConfidence(getStockConfidence())
                .shipmentRisk(getShipmentRisk())
                .build();
    }

    private List<InventoryAgingResponse> getAgingInventory() {
        return inventoryRepository.findAll().stream()
                .map(inv -> {
                    long days = ChronoUnit.DAYS.between(inv.getCreatedAt(), Instant.now());
                    return InventoryAgingResponse.builder()
                            .inventoryId(inv.getInventoryId())
                            .productName(inv.getProduct().getName())
                            .blockName(inv.getBlock().getName())
                            .quantity(inv.getQuantity())
                            .daysInWarehouse(days)
                            .build();
                })
                .sorted((a, b) -> Long.compare(b.getDaysInWarehouse(), a.getDaysInWarehouse()))
                .limit(7)
                .collect(Collectors.toList());
    }

    private List<ProcessAgingResponse> getStuckOrders() {
        // Use the new repository method for optimization
        Instant threshold = Instant.now().minus(24, ChronoUnit.HOURS);
        List<Order> stuckOrders = orderRepository.findStuckOrders(threshold);

        return stuckOrders.stream()
                .map(order -> {
                    long hours = ChronoUnit.HOURS.between(order.getCreatedAt(), Instant.now());
                    return ProcessAgingResponse.builder()
                            .orderId(order.getOrderId())
                            .orderNumber(order.getOrderNumber())
                            .status(order.getStatus().toString())
                            .hoursInState(hours)
                            .build();
                })
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    public List<PickHeatmapResponse> getPickHeatmap() {
        return blockRepository.findAll().stream()
                .map(block -> {
                    long activePicks = pickTaskRepository.countByBlockBlockIdAndStatusIn(
                            block.getBlockId(),
                            List.of(PickTaskStatus.ASSIGNED, PickTaskStatus.IN_PROGRESS));

                    String congestion = "LOW";
                    if (activePicks > 5)
                        congestion = "CRITICAL";
                    else if (activePicks > 2)
                        congestion = "MEDIUM";

                    return PickHeatmapResponse.builder()
                            .blockId(block.getBlockId())
                            .blockName(block.getName())
                            .activePicksCount(activePicks)
                            .congestionLevel(congestion)
                            .build();
                })
                .filter(r -> r.getActivePicksCount() > 0)
                .collect(Collectors.toList());
    }

    @Override
    public List<PickerWorkloadResponse> getPickerWorkload() {
        LocalDate today = LocalDate.now();
        Instant startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).minusNanos(1).toInstant();

        return userRepository.findByUserRole(UserRole.PICKER).stream()
                .map(user -> {
                    long active = pickTaskRepository.countByAssignedToAndStatusIn(
                            user.getUsername(),
                            List.of(PickTaskStatus.ASSIGNED, PickTaskStatus.IN_PROGRESS));
                    long completedToday = pickTaskRepository.countByAssignedToAndStatusAndCompletedAtBetween(
                            user.getUsername(),
                            PickTaskStatus.COMPLETED,
                            startOfDay,
                            endOfDay);

                    String status = active > 0 ? "ACTIVE" : "IDLE";
                    if (active > 8)
                        status = "OVERLOADED";

                    return PickerWorkloadResponse.builder()
                            .username(user.getUsername())
                            .activeTaskCount(active)
                            .completedTodayCount(completedToday)
                            .status(status)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<StockConfidenceResponse> getStockConfidence() {
        return inventoryRepository.findAll().stream()
                .map(inv -> {
                    long days = ChronoUnit.DAYS.between(inv.getLastModifiedAt(), Instant.now());
                    int score = 100;
                    String level = "HIGH";
                    String reason = "Fresh";

                    if (days > 60) {
                        score = 50;
                        level = "LOW";
                        reason = "No Movement > 60 days";
                    }

                    if (inv.getQuantity() < 0) {
                        score = 0;
                        level = "LOW";
                        reason = "Negative Inventory";
                    }

                    return StockConfidenceResponse.builder()
                            .productId(inv.getProduct().getProductId())
                            .productName(inv.getProduct().getName())
                            .confidenceScore(score)
                            .confidenceLevel(level)
                            .reason(reason)
                            .build();
                })
                .sorted((a, b) -> Integer.compare(a.getConfidenceScore(), b.getConfidenceScore()))
                .limit(5)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShipmentRiskResponse> getShipmentRisk() {
        return shipmentRepository.findActiveShipments().stream()
                .map(s -> {
                    long days = ChronoUnit.DAYS.between(s.getDispatchedAt(), Instant.now());
                    String risk = "LOW";
                    if (days > 5)
                        risk = "CRITICAL";
                    else if (days > 2)
                        risk = "MEDIUM";

                    if (risk.equals("LOW"))
                        return null;

                    double probability = Math.min(1.0, days / 7.0);

                    return ShipmentRiskResponse.builder()
                            .shipmentId(s.getShipmentId())
                            .trackingNumber(s.getShipmentCode())
                            .riskLevel(risk)
                            .probabilityOfDelay(probability)
                            .detectedIssue("Transit time: " + days + " days")
                            .build();
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
