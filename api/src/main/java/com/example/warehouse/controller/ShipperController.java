package com.example.warehouse.controller;

import com.example.warehouse.dto.request.ShipperRequest;
import com.example.warehouse.dto.wrapper.PageResponse;
import com.example.warehouse.dto.response.ShipperResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.entity.Shipper;
import com.example.warehouse.entity.ShipperType;
import com.example.warehouse.service.contract.ShipperService;
import com.example.warehouse.util.PageUtils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shippers")
@Validated
@RequiredArgsConstructor
public class ShipperController {

    private final ShipperService shipperService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<ShipperResponse>> createShipper(
            @Valid @RequestBody ShipperRequest request) {
        Shipper createdShipper = shipperService.createShipper(toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseStructure<>(HttpStatus.CREATED.value(), "Shipper created successfully",
                        toResponse(createdShipper)));
    }

    @GetMapping("/{shipperId}")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<ShipperResponse>> getShipperById(@PathVariable @NotBlank String shipperId) {
        Shipper shipper = shipperService.getShipperById(shipperId);
        return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipper found", toResponse(shipper)));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<ShipperResponse>>> getAllShippers() {
        List<Shipper> shippers = shipperService.getAllShippers();
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shippers retrieved successfully",
                        shippers.stream().map(this::toResponse).toList()));
    }

    @GetMapping(params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<ShipperResponse>>> getAllShippersPaged(Pageable pageable) {
        List<ShipperResponse> shippers = shipperService.getAllShippers().stream().map(this::toResponse).toList();
        PageResponse<ShipperResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(shippers, pageable));
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shippers retrieved successfully", pageResponse));
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<ShipperResponse>>> getShippersByType(@PathVariable ShipperType type) {
        List<Shipper> shippers = shipperService.getShippersByType(type);
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shippers retrieved successfully",
                        shippers.stream().map(this::toResponse).toList()));
    }

    @GetMapping(value = "/type/{type}", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<ShipperResponse>>> getShippersByTypePaged(
            @PathVariable ShipperType type, Pageable pageable) {
        List<ShipperResponse> shippers = shipperService.getShippersByType(type).stream().map(this::toResponse).toList();
        PageResponse<ShipperResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(shippers, pageable));
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shippers retrieved successfully", pageResponse));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<ShipperResponse>>> getActiveShippers() {
        List<Shipper> shippers = shipperService.getActiveShippers();
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Active shippers retrieved successfully",
                        shippers.stream().map(this::toResponse).toList()));
    }

    @GetMapping(value = "/active", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<ShipperResponse>>> getActiveShippersPaged(Pageable pageable) {
        List<ShipperResponse> shippers = shipperService.getActiveShippers().stream().map(this::toResponse).toList();
        PageResponse<ShipperResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(shippers, pageable));
        return ResponseEntity.ok(
                new ResponseStructure<>(HttpStatus.OK.value(), "Active shippers retrieved successfully", pageResponse));
    }

    @PutMapping("/{shipperId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<ShipperResponse>> updateShipper(@PathVariable @NotBlank String shipperId,
            @Valid @RequestBody ShipperRequest request) {
        Shipper updatedShipper = shipperService.updateShipper(shipperId, toEntity(request));
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipper updated successfully",
                        toResponse(updatedShipper)));
    }

    @DeleteMapping("/{shipperId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<Void>> deleteShipper(@PathVariable @NotBlank String shipperId) {
        shipperService.deleteShipper(shipperId);
        return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipper deleted successfully", null));
    }

    @PostMapping("/{shipperId}/restore")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<ShipperResponse>> restoreShipper(@PathVariable @NotBlank String shipperId) {
        Shipper restoredShipper = shipperService.restoreShipper(shipperId);
        return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipper restored successfully",
                toResponse(restoredShipper)));
    }

    private Shipper toEntity(ShipperRequest request) {
        Shipper shipper = new Shipper();
        shipper.setName(request.name());
        shipper.setType(request.type());
        shipper.setServiceLevel(request.serviceLevel());
        shipper.setTrackingUrlTemplate(request.trackingUrlTemplate());
        shipper.setContactDetails(request.contactDetails());
        shipper.setActive(request.active() != null ? request.active() : Boolean.TRUE);
        return shipper;
    }

    private ShipperResponse toResponse(Shipper shipper) {
        return ShipperResponse.builder()
                .shipperId(shipper.getShipperId())
                .name(shipper.getName())
                .type(shipper.getType())
                .serviceLevel(shipper.getServiceLevel())
                .trackingUrlTemplate(shipper.getTrackingUrlTemplate())
                .contactDetails(shipper.getContactDetails())
                .active(shipper.getActive())
                .createdAt(shipper.getCreatedAt())
                .lastModifiedAt(shipper.getLastModifiedAt())
                .build();
    }
}
