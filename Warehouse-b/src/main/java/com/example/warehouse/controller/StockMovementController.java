package com.example.warehouse.controller;

import com.example.warehouse.dto.request.StockMovementRequest;
import com.example.warehouse.dto.response.StockMovementResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.StockMovementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/stock-movements")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<StockMovementResponse>> recordMovement(
            @RequestBody StockMovementRequest request,
            Principal principal) {
        StockMovementResponse response = stockMovementService.recordMovement(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseStructure<>(
                        HttpStatus.CREATED.value(),
                        "Stock movement recorded successfully",
                        response));
    }

    @GetMapping("/{movementId}")
    public ResponseEntity<ResponseStructure<StockMovementResponse>> getMovementById(@PathVariable String movementId) {
        StockMovementResponse response = stockMovementService.getMovementById(movementId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Movement retrieved successfully",
                response));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ResponseStructure<List<StockMovementResponse>>> getMovementsByProduct(
            @PathVariable String productId) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByProduct(productId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Product movements retrieved successfully",
                movements));
    }

    @GetMapping("/block/{blockId}")
    public ResponseEntity<ResponseStructure<List<StockMovementResponse>>> getMovementsByBlock(
            @PathVariable String blockId) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByBlock(blockId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Block movements retrieved successfully",
                movements));
    }

    @GetMapping("/type/{movementType}")
    public ResponseEntity<ResponseStructure<List<StockMovementResponse>>> getMovementsByType(
            @PathVariable String movementType) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByType(movementType);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Movements by type retrieved successfully",
                movements));
    }

    @GetMapping("/recent")
    public ResponseEntity<ResponseStructure<List<StockMovementResponse>>> getRecentMovements(
            @RequestParam(defaultValue = "50") int limit) {
        List<StockMovementResponse> movements = stockMovementService.getRecentMovements(limit);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Recent movements retrieved successfully",
                movements));
    }

    @GetMapping("/user/{username}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<List<StockMovementResponse>>> getMovementsByUser(
            @PathVariable String username) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByUser(username);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "User movements retrieved successfully",
                movements));
    }

    @GetMapping
    public ResponseEntity<ResponseStructure<List<StockMovementResponse>>> getAllMovements() {
        List<StockMovementResponse> movements = stockMovementService.getAllMovements();
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "All movements retrieved successfully",
                movements));
    }
}
