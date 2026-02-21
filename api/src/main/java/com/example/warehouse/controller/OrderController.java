package com.example.warehouse.controller;

import com.example.warehouse.dto.request.OrderRequest;
import com.example.warehouse.dto.request.PickTaskAssignmentRequest;
import com.example.warehouse.dto.response.OrderResponse;
import com.example.warehouse.dto.response.PickTaskResponse;
import com.example.warehouse.dto.wrapper.PageResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.OrderService;
import com.example.warehouse.util.PageUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@Validated
@Tag(name = "Orders", description = "Order and picking endpoints")
public class OrderController {

        private final OrderService orderService;

        public OrderController(OrderService orderService) {
                this.orderService = orderService;
        }

        @PostMapping
        @PreAuthorize("hasAnyAuthority('ADMIN', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        @Operation(summary = "Create order")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Order created", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                                        {"status":201,"message":"Order created successfully","data":{"orderId":"5a5f96aa-aa39-41e5-a689-950a23f1f0aa","orderNumber":"SO-2026-0001","customerName":"Acme Retail","customerEmail":"ops@acme-retail.com","shippingAddress":"21 Industrial Ave, Austin, TX","status":"PENDING","totalItems":12,"notes":"Fragile items, handle with care","pickTasks":[],"createdAt":1739635200000}}
                                        """))),
                        @ApiResponse(responseCode = "400", description = "Validation failed")
        })
        public ResponseEntity<ResponseStructure<OrderResponse>> createOrder(@Valid @RequestBody OrderRequest request) {
                OrderResponse response = orderService.createOrder(request);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new ResponseStructure<>(
                                                HttpStatus.CREATED.value(),
                                                "Order created successfully",
                                                response));
        }

        @GetMapping("/{orderId}")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        @Operation(summary = "Get order by id")
        @ApiResponse(responseCode = "200", description = "Order retrieved", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                        {"status":200,"message":"Order retrieved successfully","data":{"orderId":"5a5f96aa-aa39-41e5-a689-950a23f1f0aa","orderNumber":"SO-2026-0001","customerName":"Acme Retail","customerEmail":"ops@acme-retail.com","shippingAddress":"21 Industrial Ave, Austin, TX","status":"PICK_ASSIGNED","totalItems":12}}
                        """)))
        public ResponseEntity<ResponseStructure<OrderResponse>> getOrderById(@PathVariable String orderId) {
                OrderResponse response = orderService.getOrderById(orderId);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Order retrieved successfully",
                                response));
        }

        @GetMapping("/number/{orderNumber}")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        public ResponseEntity<ResponseStructure<OrderResponse>> getOrderByNumber(@PathVariable String orderNumber) {
                OrderResponse response = orderService.getOrderByNumber(orderNumber);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Order retrieved successfully",
                                response));
        }

        @GetMapping
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        public ResponseEntity<ResponseStructure<List<OrderResponse>>> getAllOrders() {
                List<OrderResponse> orders = orderService.getAllOrders();
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Orders retrieved successfully",
                                orders));
        }

        @GetMapping(params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        public ResponseEntity<ResponseStructure<PageResponse<OrderResponse>>> getAllOrdersPaged(Pageable pageable) {
                List<OrderResponse> orders = orderService.getAllOrders();
                PageResponse<OrderResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(orders, pageable));
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Orders retrieved successfully",
                                pageResponse));
        }

        @GetMapping("/status/{status}")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        public ResponseEntity<ResponseStructure<List<OrderResponse>>> getOrdersByStatus(@PathVariable String status) {
                List<OrderResponse> orders = orderService.getOrdersByStatus(status);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Orders retrieved successfully",
                                orders));
        }

        @GetMapping(value = "/status/{status}", params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        public ResponseEntity<ResponseStructure<PageResponse<OrderResponse>>> getOrdersByStatusPaged(
                        @PathVariable String status, Pageable pageable) {
                List<OrderResponse> orders = orderService.getOrdersByStatus(status);
                PageResponse<OrderResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(orders, pageable));
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Orders retrieved successfully",
                                pageResponse));
        }

        @PostMapping("/assign-pickers")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        public ResponseEntity<ResponseStructure<OrderResponse>> assignPickers(
                        @Valid @RequestBody PickTaskAssignmentRequest request) {
                OrderResponse response = orderService.assignPickers(request);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Pickers assigned successfully",
                                response));
        }

        @PutMapping("/{orderId}/mark-picked")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        public ResponseEntity<ResponseStructure<OrderResponse>> markAsPicked(@PathVariable String orderId) {
                OrderResponse response = orderService.markOrderAsPicked(orderId);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Order marked as picked",
                                response));
        }

        @PutMapping("/{orderId}/mark-packed")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'WAREHOUSE_MANAGER', 'SUPERVISOR', 'PACKER')")
        public ResponseEntity<ResponseStructure<OrderResponse>> markAsPacked(@PathVariable String orderId) {
                OrderResponse response = orderService.markOrderAsPacked(orderId);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Order marked as packed",
                                response));
        }

        @PutMapping("/{orderId}/mark-dispatched")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        public ResponseEntity<ResponseStructure<OrderResponse>> markAsDispatched(@PathVariable String orderId) {
                OrderResponse response = orderService.markOrderAsDispatched(orderId);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Order marked as dispatched",
                                response));
        }

        @PutMapping("/{orderId}/cancel")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'WAREHOUSE_MANAGER')")
        public ResponseEntity<ResponseStructure<OrderResponse>> cancelOrder(@PathVariable String orderId) {
                OrderResponse response = orderService.cancelOrder(orderId);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Order cancelled successfully",
                                response));
        }

        @GetMapping("/pick-tasks/{taskId}")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR', 'PICKER')")
        public ResponseEntity<ResponseStructure<PickTaskResponse>> getPickTaskById(@PathVariable String taskId) {
                PickTaskResponse response = orderService.getPickTaskById(taskId);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Pick task retrieved successfully",
                                response));
        }

        @GetMapping("/{orderId}/pick-tasks")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR', 'PICKER')")
        public ResponseEntity<ResponseStructure<List<PickTaskResponse>>> getPickTasksByOrder(
                        @PathVariable String orderId) {
                List<PickTaskResponse> tasks = orderService.getPickTasksByOrder(orderId);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Pick tasks retrieved successfully",
                                tasks));
        }

        @GetMapping(value = "/{orderId}/pick-tasks", params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR', 'PICKER')")
        public ResponseEntity<ResponseStructure<PageResponse<PickTaskResponse>>> getPickTasksByOrderPaged(
                        @PathVariable String orderId, Pageable pageable) {
                List<PickTaskResponse> tasks = orderService.getPickTasksByOrder(orderId);
                PageResponse<PickTaskResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(tasks, pageable));
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Pick tasks retrieved successfully",
                                pageResponse));
        }

        @GetMapping("/pick-tasks/picker/{username}")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR', 'PICKER')")
        public ResponseEntity<ResponseStructure<List<PickTaskResponse>>> getPickTasksByPicker(
                        @PathVariable String username) {
                List<PickTaskResponse> tasks = orderService.getPickTasksByPicker(username);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Pick tasks retrieved successfully",
                                tasks));
        }

        @GetMapping(value = "/pick-tasks/picker/{username}", params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR', 'PICKER')")
        public ResponseEntity<ResponseStructure<PageResponse<PickTaskResponse>>> getPickTasksByPickerPaged(
                        @PathVariable String username, Pageable pageable) {
                List<PickTaskResponse> tasks = orderService.getPickTasksByPicker(username);
                PageResponse<PickTaskResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(tasks, pageable));
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Pick tasks retrieved successfully",
                                pageResponse));
        }

        @PutMapping("/pick-tasks/{taskId}/start")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'PICKER', 'WAREHOUSE_MANAGER')")
        public ResponseEntity<ResponseStructure<PickTaskResponse>> startPickTask(@PathVariable String taskId) {
                PickTaskResponse response = orderService.startPickTask(taskId);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Pick task started",
                                response));
        }

        @PutMapping("/pick-tasks/{taskId}/complete")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'PICKER', 'WAREHOUSE_MANAGER')")
        public ResponseEntity<ResponseStructure<PickTaskResponse>> completePickTask(@PathVariable String taskId) {
                PickTaskResponse response = orderService.completePickTask(taskId);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Pick task completed",
                                response));
        }

        @DeleteMapping("/{orderId}")
        @PreAuthorize("hasAuthority('ADMIN')")
        public ResponseEntity<ResponseStructure<OrderResponse>> deleteOrder(@PathVariable String orderId) {
                OrderResponse response = orderService.deleteOrder(orderId);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Order deleted successfully",
                                response));
        }

        @PostMapping("/{orderId}/restore")
        @PreAuthorize("hasAuthority('ADMIN')")
        public ResponseEntity<ResponseStructure<OrderResponse>> restoreOrder(@PathVariable String orderId) {
                OrderResponse response = orderService.restoreOrder(orderId);
                return ResponseEntity.ok(new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Order restored successfully",
                                response));
        }
}
