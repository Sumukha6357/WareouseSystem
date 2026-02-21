package com.example.warehouse.controller;

import com.example.warehouse.dto.request.CreateShipmentRequest;
import com.example.warehouse.dto.wrapper.PageResponse;
import com.example.warehouse.dto.response.ShipmentResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.entity.Shipment;
import com.example.warehouse.entity.ShipmentStatus;
import com.example.warehouse.service.contract.ShipmentService;
import com.example.warehouse.util.PageUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@Validated
@Tag(name = "Shipments", description = "Shipment lifecycle endpoints")
public class ShipmentController {

        private final ShipmentService shipmentService;

        public ShipmentController(ShipmentService shipmentService) {
                this.shipmentService = shipmentService;
        }

        @GetMapping("/all")
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR','PACKER','EXTERNAL_SHIPPER')")
        public ResponseEntity<ResponseStructure<List<ShipmentResponse>>> getAllShipments() {
                List<Shipment> shipments = shipmentService.getAllShipments();
                return ResponseEntity.ok(
                                new ResponseStructure<>(HttpStatus.OK.value(), "All shipments retrieved successfully",
                                                shipments.stream().map(this::toResponse).toList()));
        }

        @GetMapping(value = "/all", params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR','PACKER','EXTERNAL_SHIPPER')")
        public ResponseEntity<ResponseStructure<PageResponse<ShipmentResponse>>> getAllShipmentsPaged(
                        Pageable pageable) {
                List<ShipmentResponse> shipments = shipmentService.getAllShipments().stream().map(this::toResponse)
                                .toList();
                PageResponse<ShipmentResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(shipments, pageable));
                return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(),
                                "All shipments retrieved successfully", pageResponse));
        }

        @PostMapping
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'EXTERNAL_SHIPPER')")
        @Operation(summary = "Create shipment")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Shipment created", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                                        {"status":201,"message":"Shipment created successfully","data":{"shipmentId":"f151db74-d850-495d-97b3-e9ef4b47bbf1","shipmentCode":"SHP-2026-0001","orderId":"5a5f96aa-aa39-41e5-a689-950a23f1f0aa","shipperId":"c6ef92c7-7791-4221-b4f5-a5eb6c8d7547","shipperName":"QuickLine Logistics","warehouseId":"f365303f-c963-4f9f-8854-805f6e7f7b3e","status":"CREATED","trackingNumber":"TRK-7B4A21FF"}}
                                        """))),
                        @ApiResponse(responseCode = "400", description = "Validation failed")
        })
        public ResponseEntity<ResponseStructure<ShipmentResponse>> createShipment(
                        @Valid @RequestBody CreateShipmentRequest request) {
                Shipment shipment = shipmentService.createShipment(request);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new ResponseStructure<>(HttpStatus.CREATED.value(),
                                                "Shipment created successfully",
                                                toResponse(shipment)));
        }

        @GetMapping("/{shipmentId}")
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR','PACKER','EXTERNAL_SHIPPER')")
        @Operation(summary = "Get shipment by id")
        @ApiResponse(responseCode = "200", description = "Shipment found", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                        {"status":200,"message":"Shipment found","data":{"shipmentId":"f151db74-d850-495d-97b3-e9ef4b47bbf1","shipmentCode":"SHP-2026-0001","orderId":"5a5f96aa-aa39-41e5-a689-950a23f1f0aa","shipperId":"c6ef92c7-7791-4221-b4f5-a5eb6c8d7547","shipperName":"QuickLine Logistics","warehouseId":"f365303f-c963-4f9f-8854-805f6e7f7b3e","status":"DISPATCHED","trackingNumber":"TRK-7B4A21FF"}}
                        """)))
        public ResponseEntity<ResponseStructure<ShipmentResponse>> getShipmentById(
                        @PathVariable @NotBlank String shipmentId) {
                Shipment shipment = shipmentService.getShipmentById(shipmentId);
                return ResponseEntity.ok(
                                new ResponseStructure<>(HttpStatus.OK.value(), "Shipment found", toResponse(shipment)));
        }

        @GetMapping("/order/{orderId}")
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR','PACKER','EXTERNAL_SHIPPER')")
        public ResponseEntity<ResponseStructure<List<ShipmentResponse>>> getShipmentsByOrder(
                        @PathVariable @NotBlank String orderId) {
                List<Shipment> shipments = shipmentService.getShipmentsByOrderId(orderId);
                return ResponseEntity
                                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipments retrieved successfully",
                                                shipments.stream().map(this::toResponse).toList()));
        }

        @GetMapping(value = "/order/{orderId}", params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR','PACKER','EXTERNAL_SHIPPER')")
        public ResponseEntity<ResponseStructure<PageResponse<ShipmentResponse>>> getShipmentsByOrderPaged(
                        @PathVariable @NotBlank String orderId, Pageable pageable) {
                List<ShipmentResponse> shipments = shipmentService.getShipmentsByOrderId(orderId).stream()
                                .map(this::toResponse).toList();
                PageResponse<ShipmentResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(shipments, pageable));
                return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(),
                                "Shipments retrieved successfully", pageResponse));
        }

        @GetMapping("/status/{status}")
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR','PACKER','EXTERNAL_SHIPPER')")
        public ResponseEntity<ResponseStructure<List<ShipmentResponse>>> getShipmentsByStatus(
                        @PathVariable ShipmentStatus status) {
                List<Shipment> shipments = shipmentService.getShipmentsByStatus(status);
                return ResponseEntity
                                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipments retrieved successfully",
                                                shipments.stream().map(this::toResponse).toList()));
        }

        @GetMapping(value = "/status/{status}", params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR','PACKER','EXTERNAL_SHIPPER')")
        public ResponseEntity<ResponseStructure<PageResponse<ShipmentResponse>>> getShipmentsByStatusPaged(
                        @PathVariable ShipmentStatus status, Pageable pageable) {
                List<ShipmentResponse> shipments = shipmentService.getShipmentsByStatus(status).stream()
                                .map(this::toResponse).toList();
                PageResponse<ShipmentResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(shipments, pageable));
                return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(),
                                "Shipments retrieved successfully", pageResponse));
        }

        @GetMapping("/active")
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR','PACKER','EXTERNAL_SHIPPER')")
        public ResponseEntity<ResponseStructure<List<ShipmentResponse>>> getActiveShipments() {
                List<Shipment> shipments = shipmentService.getActiveShipments();
                return ResponseEntity.ok(
                                new ResponseStructure<>(HttpStatus.OK.value(),
                                                "Active shipments retrieved successfully",
                                                shipments.stream().map(this::toResponse).toList()));
        }

        @GetMapping(value = "/active", params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR','PACKER','EXTERNAL_SHIPPER')")
        public ResponseEntity<ResponseStructure<PageResponse<ShipmentResponse>>> getActiveShipmentsPaged(
                        Pageable pageable) {
                List<ShipmentResponse> shipments = shipmentService.getActiveShipments().stream().map(this::toResponse)
                                .toList();
                PageResponse<ShipmentResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(shipments, pageable));
                return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(),
                                "Active shipments retrieved successfully", pageResponse));
        }

        @PutMapping("/{shipmentId}/status")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'SUPERVISOR', 'PACKER', 'EXTERNAL_SHIPPER')")
        public ResponseEntity<ResponseStructure<ShipmentResponse>> updateStatus(
                        @PathVariable @NotBlank String shipmentId,
                        @RequestParam ShipmentStatus status,
                        @RequestParam(required = false) String location,
                        @RequestParam(required = false) String notes) {
                Shipment shipment = shipmentService.updateShipmentStatus(shipmentId, status, location, notes);
                return ResponseEntity
                                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Status updated successfully",
                                                toResponse(shipment)));
        }

        @PutMapping("/{shipmentId}/assign-shipper")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
        public ResponseEntity<ResponseStructure<ShipmentResponse>> assignShipper(
                        @PathVariable @NotBlank String shipmentId,
                        @RequestParam @NotBlank String shipperId) {
                Shipment shipment = shipmentService.assignShipper(shipmentId, shipperId);
                return ResponseEntity
                                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipper assigned successfully",
                                                toResponse(shipment)));
        }

        private ShipmentResponse toResponse(Shipment shipment) {
                return ShipmentResponse.builder()
                                .shipmentId(shipment.getShipmentId())
                                .shipmentCode(shipment.getShipmentCode())
                                .orderId(shipment.getOrder() != null ? shipment.getOrder().getOrderId() : null)
                                .shipperId(shipment.getShipper() != null ? shipment.getShipper().getShipperId() : null)
                                .shipperName(shipment.getShipper() != null ? shipment.getShipper().getName() : null)
                                .warehouseId(shipment.getWarehouseId())
                                .status(shipment.getStatus())
                                .trackingNumber(shipment.getTrackingNumber())
                                .createdAt(shipment.getCreatedAt())
                                .dispatchedAt(shipment.getDispatchedAt())
                                .deliveredAt(shipment.getDeliveredAt())
                                .build();
        }
}
