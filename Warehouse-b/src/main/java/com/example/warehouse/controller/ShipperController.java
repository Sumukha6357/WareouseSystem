package com.example.warehouse.controller;

import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.entity.Shipper;
import com.example.warehouse.entity.ShipperType;
import com.example.warehouse.service.contract.ShipperService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shippers")
public class ShipperController {

    private final ShipperService shipperService;

    public ShipperController(ShipperService shipperService) {
        this.shipperService = shipperService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<Shipper>> createShipper(@RequestBody Shipper shipper) {
        Shipper createdShipper = shipperService.createShipper(shipper);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseStructure<>(HttpStatus.CREATED.value(), "Shipper created successfully",
                        createdShipper));
    }

    @GetMapping("/{shipperId}")
    public ResponseEntity<ResponseStructure<Shipper>> getShipperById(@PathVariable String shipperId) {
        Shipper shipper = shipperService.getShipperById(shipperId);
        return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipper found", shipper));
    }

    @GetMapping
    public ResponseEntity<ResponseStructure<List<Shipper>>> getAllShippers() {
        List<Shipper> shippers = shipperService.getAllShippers();
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shippers retrieved successfully", shippers));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ResponseStructure<List<Shipper>>> getShippersByType(@PathVariable ShipperType type) {
        List<Shipper> shippers = shipperService.getShippersByType(type);
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shippers retrieved successfully", shippers));
    }

    @GetMapping("/active")
    public ResponseEntity<ResponseStructure<List<Shipper>>> getActiveShippers() {
        List<Shipper> shippers = shipperService.getActiveShippers();
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Active shippers retrieved successfully", shippers));
    }

    @PutMapping("/{shipperId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<Shipper>> updateShipper(@PathVariable String shipperId,
            @RequestBody Shipper shipper) {
        Shipper updatedShipper = shipperService.updateShipper(shipperId, shipper);
        return ResponseEntity
                .ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipper updated successfully", updatedShipper));
    }

    @DeleteMapping("/{shipperId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<Void>> deleteShipper(@PathVariable String shipperId) {
        shipperService.deleteShipper(shipperId);
        return ResponseEntity.ok(new ResponseStructure<>(HttpStatus.OK.value(), "Shipper deleted successfully", null));
    }
}
