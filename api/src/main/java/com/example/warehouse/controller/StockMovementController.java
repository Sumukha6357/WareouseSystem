package com.example.warehouse.controller;

import com.example.warehouse.dto.request.StockMovementRequest;
import com.example.warehouse.dto.response.StockMovementResponse;
import com.example.warehouse.dto.wrapper.PageResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.StockMovementService;
import com.example.warehouse.util.PageUtils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/stock-movements")
@Validated
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ResponseStructure<StockMovementResponse>> recordMovement(
            @Valid @RequestBody StockMovementRequest request,
            Principal principal) {
        StockMovementResponse response = stockMovementService.recordMovement(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseStructure<>(
                        HttpStatus.CREATED.value(),
                        "Stock movement recorded successfully",
                        response));
    }

    @GetMapping("/{movementId}")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<StockMovementResponse>> getMovementById(@PathVariable String movementId) {
        StockMovementResponse response = stockMovementService.getMovementById(movementId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Movement retrieved successfully",
                response));
    }

    @GetMapping("/product/{productId}")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<StockMovementResponse>>> getMovementsByProduct(
            @PathVariable String productId) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByProduct(productId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Product movements retrieved successfully",
                movements));
    }

    @GetMapping(value = "/product/{productId}", params = {"page", "size"})
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<StockMovementResponse>>> getMovementsByProductPaged(
            @PathVariable String productId, Pageable pageable) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByProduct(productId);
        PageResponse<StockMovementResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(movements, pageable));
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Product movements retrieved successfully",
                pageResponse));
    }

    @GetMapping("/block/{blockId}")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<StockMovementResponse>>> getMovementsByBlock(
            @PathVariable String blockId) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByBlock(blockId);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Block movements retrieved successfully",
                movements));
    }

    @GetMapping(value = "/block/{blockId}", params = {"page", "size"})
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<StockMovementResponse>>> getMovementsByBlockPaged(
            @PathVariable String blockId, Pageable pageable) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByBlock(blockId);
        PageResponse<StockMovementResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(movements, pageable));
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Block movements retrieved successfully",
                pageResponse));
    }

    @GetMapping("/type/{movementType}")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<StockMovementResponse>>> getMovementsByType(
            @PathVariable String movementType) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByType(movementType);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Movements by type retrieved successfully",
                movements));
    }

    @GetMapping(value = "/type/{movementType}", params = {"page", "size"})
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<StockMovementResponse>>> getMovementsByTypePaged(
            @PathVariable String movementType, Pageable pageable) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByType(movementType);
        PageResponse<StockMovementResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(movements, pageable));
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Movements by type retrieved successfully",
                pageResponse));
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<StockMovementResponse>>> getRecentMovements(
            @RequestParam(defaultValue = "50") @Positive int limit) {
        List<StockMovementResponse> movements = stockMovementService.getRecentMovements(limit);
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Recent movements retrieved successfully",
                movements));
    }

    @GetMapping(value = "/recent", params = {"page", "size"})
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<StockMovementResponse>>> getRecentMovementsPaged(
            @RequestParam(defaultValue = "50") @Positive int limit, Pageable pageable) {
        List<StockMovementResponse> movements = stockMovementService.getRecentMovements(limit);
        PageResponse<StockMovementResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(movements, pageable));
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Recent movements retrieved successfully",
                pageResponse));
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

    @GetMapping(value = "/user/{username}", params = {"page", "size"})
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<PageResponse<StockMovementResponse>>> getMovementsByUserPaged(
            @PathVariable String username, Pageable pageable) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByUser(username);
        PageResponse<StockMovementResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(movements, pageable));
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "User movements retrieved successfully",
                pageResponse));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<List<StockMovementResponse>>> getAllMovements() {
        List<StockMovementResponse> movements = stockMovementService.getAllMovements();
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "All movements retrieved successfully",
                movements));
    }

    @GetMapping(params = {"page", "size"})
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
    public ResponseEntity<ResponseStructure<PageResponse<StockMovementResponse>>> getAllMovementsPaged(Pageable pageable) {
        List<StockMovementResponse> movements = stockMovementService.getAllMovements();
        PageResponse<StockMovementResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(movements, pageable));
        return ResponseEntity.ok(new ResponseStructure<>(
                HttpStatus.OK.value(),
                "All movements retrieved successfully",
                pageResponse));
    }
}
