package com.example.warehouse.service.implementation;

import com.example.warehouse.dto.request.OrderItemRequest;
import com.example.warehouse.dto.request.OrderRequest;
import com.example.warehouse.dto.request.PickTaskAssignmentRequest;
import com.example.warehouse.dto.request.StockMovementRequest;
import com.example.warehouse.dto.response.OrderResponse;
import com.example.warehouse.dto.response.PickTaskResponse;
import com.example.warehouse.dto.response.ProductResponse;
import com.example.warehouse.entity.*;
import com.example.warehouse.repository.*;
import com.example.warehouse.service.contract.OrderService;
import com.example.warehouse.service.contract.StockMovementService;
import com.example.warehouse.service.contract.ShipmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final PickTaskRepository pickTaskRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final StockMovementService stockMovementService;
    private final ShipmentService shipmentService;

    public OrderServiceImpl(OrderRepository orderRepository,
            PickTaskRepository pickTaskRepository,
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            StockMovementService stockMovementService,
            ShipmentService shipmentService) {
        this.orderRepository = orderRepository;
        this.pickTaskRepository = pickTaskRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockMovementService = stockMovementService;
        this.shipmentService = shipmentService;
    }

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        // Create order
        Order order = new Order();
        order.setOrderNumber(request.getOrderNumber());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setShippingAddress(request.getShippingAddress());
        order.setNotes(request.getNotes());
        order.setStatus(OrderStatus.PENDING);

        int totalItems = request.getItems().stream()
                .mapToInt(OrderItemRequest::getQuantity)
                .sum();
        order.setTotalItems(totalItems);

        Order savedOrder = orderRepository.save(order);

        // Create pick tasks for each item
        List<PickTask> pickTasks = new ArrayList<>();
        for (OrderItemRequest item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));

            // Find inventory with sufficient stock
            List<Inventory> inventories = inventoryRepository.findByProductProductId(item.getProductId());
            int remainingQty = item.getQuantity();

            for (Inventory inventory : inventories) {
                if (remainingQty <= 0)
                    break;

                int availableQty = inventory.getAvailableQuantity();
                if (availableQty <= 0)
                    continue;

                int qtyToPick = Math.min(remainingQty, availableQty);

                // Create pick task
                PickTask task = new PickTask();
                task.setOrder(savedOrder);
                task.setProduct(product);
                task.setBlock(inventory.getBlock());
                task.setQuantity(qtyToPick);
                task.setStatus(PickTaskStatus.ASSIGNED);

                pickTasks.add(task);
                remainingQty -= qtyToPick;

                // Reserve stock
                int currentReserved = inventory.getReservedQuantity() != null ? inventory.getReservedQuantity() : 0;
                inventory.setReservedQuantity(currentReserved + qtyToPick);
                inventoryRepository.save(inventory);
            }

            if (remainingQty > 0) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
        }

        pickTaskRepository.saveAll(pickTasks);
        savedOrder.setPickTasks(pickTasks);

        return mapToOrderResponse(savedOrder);
    }

    @Override
    public OrderResponse getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToOrderResponse(order);
    }

    @Override
    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByStatus(String status) {
        OrderStatus orderStatus = OrderStatus.valueOf(status);
        return orderRepository.findByStatusOrderByCreatedAtDesc(orderStatus).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse assignPickers(PickTaskAssignmentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Order is not in PENDING status");
        }

        List<PickTask> tasks = pickTaskRepository.findByOrderOrderIdOrderByCreatedAtAsc(order.getOrderId());
        for (PickTask task : tasks) {
            task.setAssignedTo(request.getAssignedTo());
            task.setStatus(PickTaskStatus.ASSIGNED);
        }
        pickTaskRepository.saveAll(tasks);

        order.setStatus(OrderStatus.PICK_ASSIGNED);
        Order updatedOrder = orderRepository.save(order);

        return mapToOrderResponse(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse markOrderAsPicked(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.PICK_ASSIGNED) {
            throw new RuntimeException("Order must be in PICK_ASSIGNED status before picking can be completed");
        }

        // Verify all tasks are completed
        List<PickTask> tasks = pickTaskRepository.findByOrderOrderIdOrderByCreatedAtAsc(orderId);
        boolean allCompleted = tasks.stream()
                .allMatch(task -> task.getStatus() == PickTaskStatus.COMPLETED);

        if (!allCompleted) {
            throw new RuntimeException("Not all pick tasks are completed");
        }

        order.setStatus(OrderStatus.PICKED);
        order.setPickedAt(Instant.now());
        Order updatedOrder = orderRepository.save(order);

        return mapToOrderResponse(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse markOrderAsPacked(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.PICKED) {
            throw new RuntimeException("Order must be PICKED before packing");
        }

        order.setStatus(OrderStatus.PACKED);
        order.setPackedAt(Instant.now());
        Order updatedOrder = orderRepository.save(order);

        return mapToOrderResponse(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse markOrderAsDispatched(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.PACKED && order.getStatus() != OrderStatus.DISPATCHED) {
            // Allow idempotent retry if already dispatched, otherwise must be PACKED
            if (order.getStatus() == OrderStatus.DISPATCHED) {
                return mapToOrderResponse(order);
            }
            throw new RuntimeException("Order must be PACKED before dispatching");
        }

        // Prevent double dispatch if somehow bypassed
        if (order.getStatus() == OrderStatus.DISPATCHED) {
            return mapToOrderResponse(order);
        }

        order.setStatus(OrderStatus.DISPATCHED);
        order.setDispatchedAt(Instant.now());
        Order updatedOrder = orderRepository.save(order);

        // Record outbound movements
        List<PickTask> tasks = pickTaskRepository.findByOrderOrderIdOrderByCreatedAtAsc(orderId);
        for (PickTask task : tasks) {
            StockMovementRequest movementRequest = new StockMovementRequest();
            movementRequest.setProductId(task.getProduct().getProductId());
            movementRequest.setFromBlockId(task.getBlock().getBlockId());
            movementRequest.setQuantity(task.getQuantity());
            movementRequest.setMovementType("OUTBOUND");
            movementRequest.setReferenceType("SO");
            movementRequest.setReferenceId(order.getOrderNumber());
            movementRequest.setNotes("Dispatched for order " + order.getOrderNumber());

            try {
                stockMovementService.recordMovement(movementRequest, "SYSTEM");
            } catch (Exception e) {
                System.err.println("Failed to record outbound movement: " + e.getMessage());
            }
        }

        // AUTO-CREATE SHIPMENT
        try {
            com.example.warehouse.dto.request.CreateShipmentRequest shipmentRequest = new com.example.warehouse.dto.request.CreateShipmentRequest();
            shipmentRequest.setOrderId(orderId);
            shipmentRequest
                    .setTrackingNumber("TRK-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            // Implicitly assigning a default shipper or null if not selected yet
            com.example.warehouse.entity.Shipment shipment = shipmentService.createShipment(shipmentRequest);

            // Immediately mark shipment as DISPATCHED to match Order status
            shipmentService.updateShipmentStatus(
                    shipment.getShipmentId(),
                    com.example.warehouse.entity.ShipmentStatus.DISPATCHED,
                    "Warehouse",
                    "Auto-dispatched with Order");
        } catch (Exception e) {
            System.err.println("Failed to auto-create shipment: " + e.getMessage());
            // Don't fail the order dispatch if shipment creation fails, but log it critical
        }

        return mapToOrderResponse(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.DISPATCHED) {
            throw new RuntimeException("Cannot cancel dispatched order");
        }

        // Release reserved stock
        List<PickTask> tasks = pickTaskRepository.findByOrderOrderIdOrderByCreatedAtAsc(orderId);
        for (PickTask task : tasks) {
            if (task.getStatus() != PickTaskStatus.COMPLETED) {
                inventoryRepository
                        .findByProductProductIdAndBlockBlockId(
                                task.getProduct().getProductId(),
                                task.getBlock().getBlockId())
                        .ifPresent(inventory -> {
                            int currentReserved = inventory.getReservedQuantity() != null
                                    ? inventory.getReservedQuantity()
                                    : 0;
                            inventory.setReservedQuantity(Math.max(0, currentReserved - task.getQuantity()));
                            inventoryRepository.save(inventory);
                        });
            }
            task.setStatus(PickTaskStatus.CANCELLED);
        }
        pickTaskRepository.saveAll(tasks);

        order.setStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);

        return mapToOrderResponse(updatedOrder);
    }

    @Override
    public PickTaskResponse getPickTaskById(String taskId) {
        PickTask task = pickTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Pick task not found"));
        return mapToPickTaskResponse(task);
    }

    @Override
    public List<PickTaskResponse> getPickTasksByOrder(String orderId) {
        return pickTaskRepository.findByOrderOrderIdOrderByCreatedAtAsc(orderId).stream()
                .map(this::mapToPickTaskResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PickTaskResponse> getPickTasksByPicker(String username) {
        return pickTaskRepository.findByAssignedToOrderByCreatedAtDesc(username).stream()
                .map(this::mapToPickTaskResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PickTaskResponse startPickTask(String taskId) {
        PickTask task = pickTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Pick task not found"));

        if (task.getStatus() != PickTaskStatus.ASSIGNED) {
            throw new RuntimeException("Task is not in ASSIGNED status");
        }

        task.setStatus(PickTaskStatus.IN_PROGRESS);
        PickTask updatedTask = pickTaskRepository.save(task);

        // Record PICK movement
        StockMovementRequest movementRequest = new StockMovementRequest();
        movementRequest.setProductId(task.getProduct().getProductId());
        movementRequest.setFromBlockId(task.getBlock().getBlockId());
        movementRequest.setQuantity(task.getQuantity());
        movementRequest.setMovementType("PICK");
        movementRequest.setReferenceType("SO");
        movementRequest.setReferenceId(task.getOrder().getOrderNumber());
        movementRequest.setNotes("Picking for order " + task.getOrder().getOrderNumber());

        try {
            stockMovementService.recordMovement(movementRequest, task.getAssignedTo());
        } catch (Exception e) {
            System.err.println("Failed to record pick movement: " + e.getMessage());
        }

        return mapToPickTaskResponse(updatedTask);
    }

    @Override
    @Transactional
    public PickTaskResponse completePickTask(String taskId) {
        PickTask task = pickTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Pick task not found"));

        if (task.getStatus() != PickTaskStatus.IN_PROGRESS) {
            throw new RuntimeException("Task is not IN_PROGRESS");
        }

        task.setStatus(PickTaskStatus.COMPLETED);
        task.setCompletedAt(Instant.now());
        PickTask updatedTask = pickTaskRepository.save(task);

        // Reduce actual stock and reserved quantity
        inventoryRepository
                .findByProductProductIdAndBlockBlockId(
                        task.getProduct().getProductId(),
                        task.getBlock().getBlockId())
                .ifPresent(inventory -> {
                    // Reduce total quantity
                    inventory.setQuantity(inventory.getQuantity() - task.getQuantity());

                    // Reduce reserved quantity
                    int currentReserved = inventory.getReservedQuantity() != null ? inventory.getReservedQuantity() : 0;
                    inventory.setReservedQuantity(Math.max(0, currentReserved - task.getQuantity()));

                    inventoryRepository.save(inventory);
                });

        // Check if all tasks for this order are completed
        List<PickTask> allTasks = pickTaskRepository
                .findByOrderOrderIdOrderByCreatedAtAsc(task.getOrder().getOrderId());
        boolean allCompleted = allTasks.stream()
                .allMatch(t -> t.getStatus() == PickTaskStatus.COMPLETED);

        if (allCompleted) {
            markOrderAsPicked(task.getOrder().getOrderId());
        }

        return mapToPickTaskResponse(updatedTask);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderNumber(order.getOrderNumber());
        response.setCustomerName(order.getCustomerName());
        response.setCustomerEmail(order.getCustomerEmail());
        response.setShippingAddress(order.getShippingAddress());
        response.setStatus(order.getStatus().name());
        response.setTotalItems(order.getTotalItems());
        response.setNotes(order.getNotes());
        response.setCreatedAt(order.getCreatedAt() != null ? order.getCreatedAt().toEpochMilli() : null);
        response.setLastModifiedAt(order.getLastModifiedAt() != null ? order.getLastModifiedAt().toEpochMilli() : null);
        response.setPickedAt(order.getPickedAt() != null ? order.getPickedAt().toEpochMilli() : null);
        response.setPackedAt(order.getPackedAt() != null ? order.getPackedAt().toEpochMilli() : null);
        response.setDispatchedAt(order.getDispatchedAt() != null ? order.getDispatchedAt().toEpochMilli() : null);

        if (order.getPickTasks() != null) {
            response.setPickTasks(order.getPickTasks().stream()
                    .map(this::mapToPickTaskResponse)
                    .collect(Collectors.toList()));
        }

        return response;
    }

    private PickTaskResponse mapToPickTaskResponse(PickTask task) {
        PickTaskResponse response = new PickTaskResponse();
        response.setTaskId(task.getTaskId());
        response.setOrderId(task.getOrder().getOrderId());
        response.setOrderNumber(task.getOrder().getOrderNumber());

        ProductResponse productResponse = new ProductResponse();
        productResponse.setProductId(task.getProduct().getProductId());
        productResponse.setName(task.getProduct().getName());
        productResponse.setSku(task.getProduct().getSku());
        productResponse.setCategory(task.getProduct().getCategory());
        response.setProduct(productResponse);

        response.setBlockId(task.getBlock().getBlockId());
        response.setBlockName(
                task.getBlock().getRoom() != null
                        ? task.getBlock().getRoom().getName() + " - Block"
                        : "Block " + task.getBlock().getBlockId().substring(0, 8));
        response.setQuantity(task.getQuantity());
        response.setAssignedTo(task.getAssignedTo());
        response.setStatus(task.getStatus().name());
        response.setNotes(task.getNotes());
        response.setCreatedAt(task.getCreatedAt() != null ? task.getCreatedAt().toEpochMilli() : null);
        response.setLastModifiedAt(task.getLastModifiedAt() != null ? task.getLastModifiedAt().toEpochMilli() : null);
        response.setCompletedAt(task.getCompletedAt() != null ? task.getCompletedAt().toEpochMilli() : null);

        return response;
    }
}
