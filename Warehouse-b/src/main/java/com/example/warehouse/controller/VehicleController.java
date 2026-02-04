package com.example.warehouse.controller;

import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.entity.Vehicle;
import com.example.warehouse.service.contract.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<Vehicle>> registerVehicle(@RequestBody Vehicle vehicle) {
        Vehicle createdVehicle = vehicleService.registerVehicle(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseStructure<>(HttpStatus.CREATED.value(), "Vehicle registered successfully",
                        createdVehicle));
    }

    @GetMapping
    public ResponseEntity<ResponseStructure<List<Vehicle>>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Vehicles retrieved successfully", vehicles));
    }

    @GetMapping("/active")
    public ResponseEntity<ResponseStructure<List<Vehicle>>> getActiveVehicles() {
        List<Vehicle> vehicles = vehicleService.getActiveVehicles();
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Active vehicles retrieved successfully", vehicles));
    }

    @PutMapping("/{vehicleId}/location")
    public ResponseEntity<ResponseStructure<Vehicle>> updateLocation(
            @PathVariable String vehicleId,
            @RequestParam Double lat,
            @RequestParam Double lon) {
        Vehicle vehicle = vehicleService.updateVehicleLocation(vehicleId, lat, lon);
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Location updated successfully", vehicle));
    }
}
