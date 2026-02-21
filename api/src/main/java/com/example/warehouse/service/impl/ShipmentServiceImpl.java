package com.example.warehouse.service.impl;

import com.example.warehouse.dto.request.CreateShipmentRequest;
import com.example.warehouse.dto.request.ShipmentItemRequest;
import com.example.warehouse.entity.*;
import com.example.warehouse.exception.ResourceNotFoundException;
import com.example.warehouse.repository.*;
import com.example.warehouse.service.contract.ShipmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@SuppressWarnings("null")
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;
    private final ShipperRepository shipperRepository;
    private final ShipmentEventRepository shipmentEventRepository;

    // Dependencies to resolve Product and Block entities for items
    private final ProductRepository productRepository;
    private final BlockRepository blockRepository;

    public ShipmentServiceImpl(ShipmentRepository shipmentRepository,
            OrderRepository orderRepository,
            ShipperRepository shipperRepository,
            ShipmentEventRepository shipmentEventRepository,
            ProductRepository productRepository,
            BlockRepository blockRepository) {
        this.shipmentRepository = shipmentRepository;
        this.orderRepository = orderRepository;
        this.shipperRepository = shipperRepository;
        this.shipmentEventRepository = shipmentEventRepository;
        this.productRepository = productRepository;
        this.blockRepository = blockRepository;
    }

    @Override
    @Transactional
    public Shipment createShipment(CreateShipmentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + request.getOrderId()));

        Shipper shipper = null;
        if (request.getShipperId() != null) {
            shipper = shipperRepository.findById(request.getShipperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shipper not found: " + request.getShipperId()));
        } else {
            // Auto-assign the first active shipper if none selected
            shipper = shipperRepository.findByActiveTrue().stream().findFirst()
                    .orElseGet(() -> {
                        // Create a default shipper if none exist
                        Shipper newShipper = new Shipper();
                        newShipper.setName("In-House Logistics");
                        newShipper.setType(ShipperType.INTERNAL);
                        newShipper.setServiceLevel(ServiceLevel.STANDARD);
                        newShipper.setActive(true);
                        newShipper.setCreatedAt(Instant.now());
                        newShipper.setLastModifiedAt(Instant.now());
                        return shipperRepository.save(newShipper);
                    });
        }

        Shipment shipment = new Shipment();
        shipment.setShipmentCode("SHP-" + System.currentTimeMillis()); // Simple ID generation
        shipment.setOrder(order);
        shipment.setShipper(shipper);
        shipment.setShipper(shipper);
        // Prioritize request warehouseId (e.g. for inter-warehouse transfers), fallback
        // to context
        String ctxWarehouseId = com.example.warehouse.config.WarehouseContext.getWarehouseId();
        shipment.setWarehouseId(request.getWarehouseId() != null ? request.getWarehouseId() : ctxWarehouseId);
        shipment.setTrackingNumber(request.getTrackingNumber());
        shipment.setStatus(ShipmentStatus.CREATED);
        shipment.setCreatedAt(Instant.now());
        shipment.setShipmentItems(new ArrayList<>());

        Shipment savedShipment = shipmentRepository.save(shipment);

        // Process items
        if (request.getItems() != null) {
            for (ShipmentItemRequest itemRequest : request.getItems()) {
                Product product = productRepository.findById(itemRequest.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found: " + itemRequest.getProductId()));

                Block block = blockRepository.findById(itemRequest.getBlockId())
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Block not found: " + itemRequest.getBlockId()));

                ShipmentItem item = new ShipmentItem();
                item.setShipment(savedShipment);
                item.setProduct(product);
                item.setBlock(block);
                item.setQuantity(itemRequest.getQuantity());

                savedShipment.getShipmentItems().add(item);
            }
            // Save again to cascade items if CascadeType.ALL is set, otherwise might need
            // explicit Item repo save
            // Assuming CascadeType.ALL on Shipment.items
            savedShipment = shipmentRepository.save(savedShipment);
        }

        // Record initial event
        recordEvent(savedShipment, EventType.PICKED, "Shipment created", null, null);

        return savedShipment;
    }

    @Override
    public Shipment getShipmentById(String shipmentId) {
        return shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found: " + shipmentId));
    }

    @Override
    public Shipment getShipmentByCode(String shipmentCode) {
        return shipmentRepository.findByShipmentCode(shipmentCode)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with code: " + shipmentCode));
    }

    @Override
    public List<Shipment> getShipmentsByOrderId(String orderId) {
        return shipmentRepository.findByOrderOrderIdOrderByCreatedAtDesc(orderId);
    }

    @Override
    public List<Shipment> getShipmentsByStatus(ShipmentStatus status) {
        return shipmentRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    @Override
    public List<Shipment> getActiveShipments() {
        return shipmentRepository.findActiveShipments();
    }

    @Override
    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public Shipment updateShipmentStatus(String shipmentId, ShipmentStatus status, String location, String notes) {
        Shipment shipment = getShipmentById(shipmentId);
        shipment.setStatus(status);

        EventType eventType = mapStatusToEventType(status);
        if (eventType != null) {
            recordEvent(shipment, eventType, notes != null ? notes : "Status updated to " + status, null, null);
        }

        if (status == ShipmentStatus.DISPATCHED) {
            shipment.setDispatchedAt(Instant.now());
        } else if (status == ShipmentStatus.DELIVERED) {
            shipment.setDeliveredAt(Instant.now());
        }

        return shipmentRepository.save(shipment);
    }

    @Override
    @Transactional
    public Shipment assignShipper(String shipmentId, String shipperId) {
        Shipment shipment = getShipmentById(shipmentId);
        Shipper shipper = shipperRepository.findById(shipperId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipper not found: " + shipperId));

        shipment.setShipper(shipper);
        return shipmentRepository.save(shipment);
    }

    @Override
    public void deleteShipment(String shipmentId) {
        Shipment shipment = getShipmentById(shipmentId);
        shipmentRepository.delete(shipment);
    }

    private void recordEvent(Shipment shipment, EventType type, String message, Double lat, Double lon) {
        ShipmentEvent event = new ShipmentEvent();
        event.setShipment(shipment);
        event.setEventType(type);
        event.setMessage(message);
        event.setLatitude(lat);
        event.setLongitude(lon);
        event.setCreatedAt(Instant.now());
        // event.setCreatedBy(SecurityContextHolder...);
        shipmentEventRepository.save(event);
    }

    private EventType mapStatusToEventType(ShipmentStatus status) {
        switch (status) {
            case PICKED:
                return EventType.PICKED;
            case PACKED:
                return EventType.PACKED;
            case READY_TO_DISPATCH:
                return EventType.LOADED;
            case DISPATCHED:
                return EventType.DISPATCHED;
            case DELIVERED:
                return EventType.DELIVERED;
            default:
                return null;
        }
    }
}
