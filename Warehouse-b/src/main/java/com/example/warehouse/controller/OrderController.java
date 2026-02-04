package com.example.warehouse.controller;

import com.example.warehouse.dto.request.OrderRequest;
import com.example.warehouse.dto.request.PickTaskAssignmentRequest;
import com.example.warehouse.dto.response.OrderResponse;
import com.example.warehouse.dto.response.PickTaskResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<OrderResponse>> createOrder(@RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseStructure<>(
                        HttpStatus.CREATED.value(),
                        "Order created successfully",
                        response));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ResponseStructure<OrderResponse>> getOrderById(@PathVariable String orderId) {
        OrderResponse response = orderService.getOrderById(orderId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Order retrieved successfully",
                response));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ResponseStructure<OrderResponse>> getOrderByNumber(@PathVariable String orderNumber) {
        OrderResponse response = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Order retrieved successfully",
                response));
    }

    @GetMapping
    public ResponseEntity<ResponseStructure<List<OrderResponse>>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Orders retrieved successfully",
                orders));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ResponseStructure<List<OrderResponse>>> getOrdersByStatus(@PathVariable String status) {
        List<OrderResponse> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Orders retrieved successfully",
                orders));
    }

    @PostMapping("/assign-pickers")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<OrderResponse>> assignPickers(
            @RequestBody PickTaskAssignmentRequest request) {
        OrderResponse response = orderService.assignPickers(request);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Pickers assigned successfully",
                response));
    }

    @PutMapping("/{orderId}/mark-picked")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<OrderResponse>> markAsPicked(@PathVariable String orderId) {
        OrderResponse response = orderService.markOrderAsPicked(orderId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Order marked as picked",
                response));
    }

    @PutMapping("/{orderId}/mark-packed")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<OrderResponse>> markAsPacked(@PathVariable String orderId) {
        OrderResponse response = orderService.markOrderAsPacked(orderId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Order marked as packed",
                response));
    }

    @PutMapping("/{orderId}/mark-dispatched")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<OrderResponse>> markAsDispatched(@PathVariable String orderId) {
        OrderResponse response = orderService.markOrderAsDispatched(orderId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Order marked as dispatched",
                response));
    }

    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<OrderResponse>> cancelOrder(@PathVariable String orderId) {
        OrderResponse response = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Order cancelled successfully",
                response));
    }

    @GetMapping("/pick-tasks/{taskId}")
    public ResponseEntity<ResponseStructure<PickTaskResponse>> getPickTaskById(@PathVariable String taskId) {
        PickTaskResponse response = orderService.getPickTaskById(taskId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Pick task retrieved successfully",
                response));
    }

    @GetMapping("/{orderId}/pick-tasks")
    public ResponseEntity<ResponseStructure<List<PickTaskResponse>>> getPickTasksByOrder(@PathVariable String orderId) {
        List<PickTaskResponse> tasks = orderService.getPickTasksByOrder(orderId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Pick tasks retrieved successfully",
                tasks));
    }

    @GetMapping("/pick-tasks/picker/{username}")
    public ResponseEntity<ResponseStructure<List<PickTaskResponse>>> getPickTasksByPicker(
            @PathVariable String username) {
        List<PickTaskResponse> tasks = orderService.getPickTasksByPicker(username);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Pick tasks retrieved successfully",
                tasks));
    }

    @PutMapping("/pick-tasks/{taskId}/start")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<PickTaskResponse>> startPickTask(@PathVariable String taskId) {
        PickTaskResponse response = orderService.startPickTask(taskId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Pick task started",
                response));
    }

    @PutMapping("/pick-tasks/{taskId}/complete")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<PickTaskResponse>> completePickTask(@PathVariable String taskId) {
        PickTaskResponse response = orderService.completePickTask(taskId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Pick task completed",
                response));
    }
}
