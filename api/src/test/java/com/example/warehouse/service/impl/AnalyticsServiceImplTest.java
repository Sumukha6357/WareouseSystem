package com.example.warehouse.service.impl;

import com.example.warehouse.dto.analytics.PickHeatmapResponse;
import com.example.warehouse.dto.analytics.PickerWorkloadResponse;
import com.example.warehouse.dto.analytics.ShipmentMetricsResponse;
import com.example.warehouse.entity.Block;
import com.example.warehouse.entity.OrderStatus;
import com.example.warehouse.entity.PickTaskStatus;
import com.example.warehouse.entity.ShipmentStatus;
import com.example.warehouse.entity.User;
import com.example.warehouse.enums.UserRole;
import com.example.warehouse.repository.BlockRepository;
import com.example.warehouse.repository.InventoryRepository;
import com.example.warehouse.repository.OrderRepository;
import com.example.warehouse.repository.PickTaskRepository;
import com.example.warehouse.repository.ShipmentRepository;
import com.example.warehouse.repository.StockMovementRepository;
import com.example.warehouse.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceImplTest {

    @Mock
    private BlockRepository blockRepository;
    @Mock
    private ShipmentRepository shipmentRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private InventoryRepository inventoryRepository;
    @Mock
    private PickTaskRepository pickTaskRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private StockMovementRepository stockMovementRepository;

    private AnalyticsServiceImpl analyticsService;

    @BeforeEach
    void setUp() {
        analyticsService = new AnalyticsServiceImpl(
                blockRepository,
                shipmentRepository,
                orderRepository,
                inventoryRepository,
                pickTaskRepository,
                userRepository,
                stockMovementRepository);
    }

    @Test
    void getShipmentMetrics_shouldUseDeliveredAtDayRange() {
        when(shipmentRepository.count()).thenReturn(100L);
        when(shipmentRepository.countByStatusIn(List.of(ShipmentStatus.DISPATCHED, ShipmentStatus.IN_TRANSIT)))
                .thenReturn(12L);
        when(shipmentRepository.countByStatusIn(List.of(ShipmentStatus.FAILED, ShipmentStatus.RETURNED)))
                .thenReturn(7L);
        when(shipmentRepository.countByStatusAndDeliveredAtBetween(
                org.mockito.ArgumentMatchers.eq(ShipmentStatus.DELIVERED),
                org.mockito.ArgumentMatchers.any(Instant.class),
                org.mockito.ArgumentMatchers.any(Instant.class)))
                .thenReturn(9L);

        ShipmentMetricsResponse response = analyticsService.getShipmentMetrics();

        assertThat(response.getTotalShipments()).isEqualTo(100L);
        assertThat(response.getShipmentsInTransit()).isEqualTo(12L);
        assertThat(response.getFailedShipments()).isEqualTo(7L);
        assertThat(response.getDeliveredToday()).isEqualTo(9L);

        ArgumentCaptor<Instant> startCaptor = ArgumentCaptor.forClass(Instant.class);
        ArgumentCaptor<Instant> endCaptor = ArgumentCaptor.forClass(Instant.class);
        verify(shipmentRepository).countByStatusAndDeliveredAtBetween(
                org.mockito.ArgumentMatchers.eq(ShipmentStatus.DELIVERED),
                startCaptor.capture(),
                endCaptor.capture());
        assertThat(startCaptor.getValue()).isBefore(endCaptor.getValue());
    }

    @Test
    void getPickerWorkload_shouldUseOnlyPickerUsersAndActualTaskCounts() {
        User pickerA = new User();
        pickerA.setUsername("picker-a");
        pickerA.setUserRole(UserRole.PICKER);

        User pickerB = new User();
        pickerB.setUsername("picker-b");
        pickerB.setUserRole(UserRole.PICKER);

        when(userRepository.findByUserRole(UserRole.PICKER)).thenReturn(List.of(pickerA, pickerB));
        when(pickTaskRepository.countByAssignedToAndStatusIn(
                "picker-a", List.of(PickTaskStatus.ASSIGNED, PickTaskStatus.IN_PROGRESS)))
                .thenReturn(2L);
        when(pickTaskRepository.countByAssignedToAndStatusIn(
                "picker-b", List.of(PickTaskStatus.ASSIGNED, PickTaskStatus.IN_PROGRESS)))
                .thenReturn(9L);
        when(pickTaskRepository.countByAssignedToAndStatusAndCompletedAtBetween(
                org.mockito.ArgumentMatchers.eq("picker-a"),
                org.mockito.ArgumentMatchers.eq(PickTaskStatus.COMPLETED),
                org.mockito.ArgumentMatchers.any(Instant.class),
                org.mockito.ArgumentMatchers.any(Instant.class)))
                .thenReturn(4L);
        when(pickTaskRepository.countByAssignedToAndStatusAndCompletedAtBetween(
                org.mockito.ArgumentMatchers.eq("picker-b"),
                org.mockito.ArgumentMatchers.eq(PickTaskStatus.COMPLETED),
                org.mockito.ArgumentMatchers.any(Instant.class),
                org.mockito.ArgumentMatchers.any(Instant.class)))
                .thenReturn(1L);

        List<PickerWorkloadResponse> response = analyticsService.getPickerWorkload();

        assertThat(response).hasSize(2);
        assertThat(response)
                .extracting(PickerWorkloadResponse::getUsername, PickerWorkloadResponse::getActiveTaskCount,
                        PickerWorkloadResponse::getCompletedTodayCount, PickerWorkloadResponse::getStatus)
                .containsExactlyInAnyOrder(
                        org.assertj.core.groups.Tuple.tuple("picker-a", 2L, 4L, "ACTIVE"),
                        org.assertj.core.groups.Tuple.tuple("picker-b", 9L, 1L, "OVERLOADED"));

        verify(userRepository).findByUserRole(UserRole.PICKER);
    }

    @Test
    void getPickHeatmap_shouldUseActiveTaskCountsPerBlock() {
        Block blockA = new Block();
        blockA.setBlockId("block-a");
        blockA.setName("A");
        Block blockB = new Block();
        blockB.setBlockId("block-b");
        blockB.setName("B");

        when(blockRepository.findAll()).thenReturn(List.of(blockA, blockB));
        when(pickTaskRepository.countByBlockBlockIdAndStatusIn(
                "block-a", List.of(PickTaskStatus.ASSIGNED, PickTaskStatus.IN_PROGRESS)))
                .thenReturn(3L);
        when(pickTaskRepository.countByBlockBlockIdAndStatusIn(
                "block-b", List.of(PickTaskStatus.ASSIGNED, PickTaskStatus.IN_PROGRESS)))
                .thenReturn(0L);

        List<PickHeatmapResponse> response = analyticsService.getPickHeatmap();

        assertThat(response).hasSize(1);
        assertThat(response.get(0).getBlockId()).isEqualTo("block-a");
        assertThat(response.get(0).getActivePicksCount()).isEqualTo(3L);
        assertThat(response.get(0).getCongestionLevel()).isEqualTo("MEDIUM");
    }

    @Test
    void getDashboardSummary_shouldExposeAccurateCountBasedMetrics() {
        User picker = new User();
        picker.setUsername("picker-1");
        picker.setUserRole(UserRole.PICKER);

        when(shipmentRepository.count()).thenReturn(20L);
        when(shipmentRepository.countByStatusIn(List.of(ShipmentStatus.DISPATCHED, ShipmentStatus.IN_TRANSIT)))
                .thenReturn(5L);
        when(shipmentRepository.countByStatusIn(List.of(ShipmentStatus.FAILED, ShipmentStatus.RETURNED)))
                .thenReturn(2L);
        when(shipmentRepository.countByStatusAndDeliveredAtBetween(
                org.mockito.ArgumentMatchers.eq(ShipmentStatus.DELIVERED),
                org.mockito.ArgumentMatchers.any(Instant.class),
                org.mockito.ArgumentMatchers.any(Instant.class)))
                .thenReturn(6L);
        when(orderRepository.findByStatusOrderByCreatedAtDesc(OrderStatus.DISPATCHED)).thenReturn(List.of());
        when(stockMovementRepository.findTopMovers()).thenReturn(List.of());
        when(blockRepository.findAll()).thenReturn(List.of());
        when(inventoryRepository.findAll()).thenReturn(List.of());
        when(orderRepository.findStuckOrders(org.mockito.ArgumentMatchers.any(Instant.class))).thenReturn(List.of());
        when(userRepository.findByUserRole(UserRole.PICKER)).thenReturn(List.of(picker));
        when(pickTaskRepository.countByAssignedToAndStatusIn(
                "picker-1", List.of(PickTaskStatus.ASSIGNED, PickTaskStatus.IN_PROGRESS)))
                .thenReturn(3L);
        when(pickTaskRepository.countByAssignedToAndStatusAndCompletedAtBetween(
                org.mockito.ArgumentMatchers.eq("picker-1"),
                org.mockito.ArgumentMatchers.eq(PickTaskStatus.COMPLETED),
                org.mockito.ArgumentMatchers.any(Instant.class),
                org.mockito.ArgumentMatchers.any(Instant.class)))
                .thenReturn(2L);
        when(shipmentRepository.findActiveShipments()).thenReturn(List.of());

        var summary = analyticsService.getDashboardSummary();

        assertThat(summary.getShipmentMetrics().getDeliveredToday()).isEqualTo(6L);
        assertThat(summary.getShipmentMetrics().getTotalShipments()).isEqualTo(20L);
        assertThat(summary.getPickerWorkload()).hasSize(1);
        assertThat(summary.getPickerWorkload().get(0).getActiveTaskCount()).isEqualTo(3L);
        assertThat(summary.getPickerWorkload().get(0).getCompletedTodayCount()).isEqualTo(2L);
    }
}
