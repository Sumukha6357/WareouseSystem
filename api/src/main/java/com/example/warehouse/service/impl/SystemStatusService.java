package com.example.warehouse.service.impl;

import com.example.warehouse.dto.response.SystemHealthResponse;
import com.example.warehouse.entity.OrderStatus;
import com.example.warehouse.repository.OrderRepository;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.concurrent.atomic.AtomicInteger;

@Service
public class SystemStatusService {

    private final AtomicInteger activeWebSocketSessions = new AtomicInteger(0);
    private final OrderRepository orderRepository;
    private double lastMeasuredLatency = 0.0;
    private long lastInventorySyncTime = System.currentTimeMillis();

    public SystemStatusService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        activeWebSocketSessions.incrementAndGet();
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        activeWebSocketSessions.decrementAndGet();
    }

    public void updateLatency(double latencyMs) {
        this.lastMeasuredLatency = latencyMs;
    }

    public void updateInventorySyncTime() {
        this.lastInventorySyncTime = System.currentTimeMillis();
    }

    public SystemHealthResponse getSystemHealth() {
        SystemHealthResponse response = new SystemHealthResponse();
        response.setApiLatencyMs(lastMeasuredLatency);
        response.setWebSocketSessions(activeWebSocketSessions.get());
        response.setLastInventorySyncTime(lastInventorySyncTime);

        // Count stuck orders (e.g., PENDING or PICK_ASSIGNED for > 2 hours)
        // Simplified for now - just returning count of non-completed/non-cancelled
        // orders
        long stuckCount = orderRepository.countByStatusNotIn(
                java.util.List.of(OrderStatus.DISPATCHED, OrderStatus.CANCELLED));
        response.setStuckOrdersCount((int) stuckCount);

        // Determine system status
        if (lastMeasuredLatency > 500 || stuckCount > 50) {
            response.setSystemStatus("CRITICAL");
        } else if (lastMeasuredLatency > 200 || stuckCount > 20) {
            response.setSystemStatus("STRESSED");
        } else {
            response.setSystemStatus("OPTIMAL");
        }

        return response;
    }
}
