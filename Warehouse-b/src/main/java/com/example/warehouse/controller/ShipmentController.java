package com.example.warehouse.controller;

import com.example.warehouse.dto.request.CreateShipmentRequest;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.entity.Shipment;
import com.example.warehouse.entity.ShipmentStatus;
import com.example.warehouse.service.contract.ShipmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shipments")
public class ShipmentController {

    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseStructure<List<Shipment>>> getAllShipments() {
        List<Shipment> shipments = shipmentService.getAllShipments();
        return ResponseEntity.ok(
                new ResponseStructure<>(HttpStatus.OK.value(), "All shipments retrieved successfully", shipments));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'EXTERNAL_SHIPPER')")
    public ResponseEntity<ResponseStructure<Shipment>> createShipment(@RequestBody CreateShipmentRequest request) {
        Shipment shipment = shipmentService.createShipment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseStructure<>(HttpStatus.CREATED.value(), "Shipment created successfully", shipment));
    }

    @GetMapping("/{shipmentId}")
    public ResponseEntity<ResponseStructure<Shipment>> getShipmentById(@PathVariable String shipmentId) {
        Shipment shipment = shipmentService.getShipmentById(shipmentId);
        return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipment found", shipment));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ResponseStructure<List<Shipment>>> getShipmentsByOrder(@PathVariable String orderId) {
        List<Shipment> shipments = shipmentService.getShipmentsByOrderId(orderId);
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipments retrieved successfully", shipments));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ResponseStructure<List<Shipment>>> getShipmentsByStatus(@PathVariable ShipmentStatus status) {
        List<Shipment> shipments = shipmentService.getShipmentsByStatus(status);
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipments retrieved successfully", shipments));
    }

    @GetMapping("/active")
    public ResponseEntity<ResponseStructure<List<Shipment>>> getActiveShipments() {
        List<Shipment> shipments = shipmentService.getActiveShipments();
        return ResponseEntity.ok(
                new ResponseStructure<>(HttpStatus.OK.value(), "Active shipments retrieved successfully", shipments));
    }

    @PutMapping("/{shipmentId}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'EXTERNAL_SHIPPER')")
    public ResponseEntity<ResponseStructure<Shipment>> updateStatus(
            @PathVariable String shipmentId,
            @RequestParam ShipmentStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String notes) {
        Shipment shipment = shipmentService.updateShipmentStatus(shipmentId, status, location, notes);
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Status updated successfully", shipment));
    }

    @PutMapping("/{shipmentId}/assign-shipper")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<Shipment>> assignShipper(
            @PathVariable String shipmentId,
            @RequestParam String shipperId) {
        Shipment shipment = shipmentService.assignShipper(shipmentId, shipperId);
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipper assigned successfully", shipment));
    }
}
