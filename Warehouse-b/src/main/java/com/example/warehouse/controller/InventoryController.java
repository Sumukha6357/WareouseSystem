package com.example.warehouse.controller;

import com.example.warehouse.dto.request.InventoryRequest;
import com.example.warehouse.dto.response.InventoryResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<InventoryResponse>> createInventory(@RequestBody InventoryRequest request) {
        InventoryResponse response = inventoryService.createInventory(request);
        ResponseStructure<InventoryResponse> structure = new ResponseStructure<>(
                HttpStatus.CREATED.value(),
                "Inventory created successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.CREATED);
    }

    @PutMapping("/{inventoryId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<InventoryResponse>> updateInventory(
            @PathVariable String inventoryId,
            @RequestBody InventoryRequest request) {
        InventoryResponse response = inventoryService.updateInventory(inventoryId, request);
        ResponseStructure<InventoryResponse> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Inventory updated successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @PutMapping("/{inventoryId}/adjust")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<InventoryResponse>> adjustStock(
            @PathVariable String inventoryId,
            @RequestParam Integer quantityChange) {
        InventoryResponse response = inventoryService.adjustStock(inventoryId, quantityChange);
        ResponseStructure<InventoryResponse> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Stock adjusted successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @GetMapping("/{inventoryId}")
    public ResponseEntity<ResponseStructure<InventoryResponse>> getInventoryById(@PathVariable String inventoryId) {
        InventoryResponse response = inventoryService.getInventoryById(inventoryId);
        ResponseStructure<InventoryResponse> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Inventory retrieved successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @GetMapping("/block/{blockId}")
    public ResponseEntity<ResponseStructure<List<InventoryResponse>>> getInventoriesByBlock(
            @PathVariable String blockId) {
        List<InventoryResponse> response = inventoryService.getInventoriesByBlock(blockId);
        ResponseStructure<List<InventoryResponse>> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Inventories retrieved successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ResponseStructure<List<InventoryResponse>>> getInventoriesByProduct(
            @PathVariable String productId) {
        List<InventoryResponse> response = inventoryService.getInventoriesByProduct(productId);
        ResponseStructure<List<InventoryResponse>> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Inventories retrieved successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ResponseStructure<List<InventoryResponse>>> getAllInventories() {
        List<InventoryResponse> response = inventoryService.getAllInventories();
        ResponseStructure<List<InventoryResponse>> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Inventories retrieved successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ResponseStructure<List<InventoryResponse>>> getLowStockItems() {
        List<InventoryResponse> response = inventoryService.getLowStockItems();
        ResponseStructure<List<InventoryResponse>> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Low stock items retrieved successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @DeleteMapping("/{inventoryId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<String>> deleteInventory(@PathVariable String inventoryId) {
        inventoryService.deleteInventory(inventoryId);
        ResponseStructure<String> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Inventory deleted successfully",
                null);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }
}
