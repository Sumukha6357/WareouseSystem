package com.example.warehouse.controller;

import com.example.warehouse.dto.request.VehicleRequest;
import com.example.warehouse.dto.wrapper.PageResponse;
import com.example.warehouse.dto.response.VehicleResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.entity.Vehicle;
import com.example.warehouse.service.contract.VehicleService;
import com.example.warehouse.util.PageUtils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
@Validated
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<VehicleResponse>> registerVehicle(
            @Valid @RequestBody VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleNumber(request.vehicleNumber());
        vehicle.setDriverName(request.driverName());
        vehicle.setDriverPhone(request.driverPhone());
        Vehicle createdVehicle = vehicleService.registerVehicle(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseStructure<>(HttpStatus.CREATED.value(), "Vehicle registered successfully",
                        toResponse(createdVehicle)));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<VehicleResponse>>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Vehicles retrieved successfully",
                        vehicles.stream().map(this::toResponse).toList()));
    }

    @GetMapping(params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<VehicleResponse>>> getAllVehiclesPaged(Pageable pageable) {
        List<VehicleResponse> vehicles = vehicleService.getAllVehicles().stream().map(this::toResponse).toList();
        PageResponse<VehicleResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(vehicles, pageable));
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Vehicles retrieved successfully", pageResponse));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<VehicleResponse>>> getActiveVehicles() {
        List<Vehicle> vehicles = vehicleService.getActiveVehicles();
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Active vehicles retrieved successfully",
                        vehicles.stream().map(this::toResponse).toList()));
    }

    @GetMapping(value = "/active", params = { "page", "size" })
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<VehicleResponse>>> getActiveVehiclesPaged(Pageable pageable) {
        List<VehicleResponse> vehicles = vehicleService.getActiveVehicles().stream().map(this::toResponse).toList();
        PageResponse<VehicleResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(vehicles, pageable));
        return ResponseEntity.ok(
                new ResponseStructure<>(HttpStatus.OK.value(), "Active vehicles retrieved successfully", pageResponse));
    }

    @PutMapping("/{vehicleId}/location")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<VehicleResponse>> updateLocation(
            @PathVariable @NotBlank String vehicleId,
            @RequestParam @NotNull Double lat,
            @RequestParam @NotNull Double lon) {
        Vehicle vehicle = vehicleService.updateVehicleLocation(vehicleId, lat, lon);
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Location updated successfully",
                        toResponse(vehicle)));
    }

    @DeleteMapping("/{vehicleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<Void>> deleteVehicle(@PathVariable @NotBlank String vehicleId) {
        vehicleService.deleteVehicle(vehicleId);
        return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(), "Vehicle deleted successfully", null));
    }

    @PostMapping("/{vehicleId}/restore")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<VehicleResponse>> restoreVehicle(@PathVariable @NotBlank String vehicleId) {
        Vehicle vehicle = vehicleService.restoreVehicle(vehicleId);
        return ResponseEntity.ok(
                new ResponseStructure<>(HttpStatus.OK.value(), "Vehicle restored successfully", toResponse(vehicle)));
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .vehicleId(vehicle.getVehicleId())
                .vehicleNumber(vehicle.getVehicleNumber())
                .driverName(vehicle.getDriverName())
                .driverPhone(vehicle.getDriverPhone())
                .shipperId(vehicle.getShipper() != null ? vehicle.getShipper().getShipperId() : null)
                .lastLatitude(vehicle.getLastLatitude())
                .lastLongitude(vehicle.getLastLongitude())
                .lastUpdatedAt(vehicle.getLastUpdatedAt())
                .active(vehicle.getActive())
                .build();
    }
}
