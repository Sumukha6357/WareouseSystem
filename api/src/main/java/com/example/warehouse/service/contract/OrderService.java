package com.example.warehouse.service.contract;

import com.example.warehouse.dto.request.OrderRequest;
import com.example.warehouse.dto.request.PickTaskAssignmentRequest;
import com.example.warehouse.dto.response.OrderResponse;
import com.example.warehouse.dto.response.PickTaskResponse;

import java.util.List;

public interface OrderService {

    // Order Management
    OrderResponse createOrder(OrderRequest request);

    OrderResponse getOrderById(String orderId);

    OrderResponse getOrderByNumber(String orderNumber);

    List<OrderResponse> getAllOrders();

    List<OrderResponse> getOrdersByStatus(String status);

    // Workflow Transitions
    OrderResponse assignPickers(PickTaskAssignmentRequest request);

    OrderResponse markOrderAsPicked(String orderId);

    OrderResponse markOrderAsPacked(String orderId);

    OrderResponse markOrderAsDispatched(String orderId);

    OrderResponse cancelOrder(String orderId);

    // Pick Task Management
    PickTaskResponse getPickTaskById(String taskId);

    List<PickTaskResponse> getPickTasksByOrder(String orderId);

    List<PickTaskResponse> getPickTasksByPicker(String username);

    PickTaskResponse startPickTask(String taskId);

    PickTaskResponse completePickTask(String taskId);

    OrderResponse deleteOrder(String orderId);

    OrderResponse restoreOrder(String orderId);
}
