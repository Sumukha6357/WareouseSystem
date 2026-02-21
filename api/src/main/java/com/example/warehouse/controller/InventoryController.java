package com.example.warehouse.controller;

import com.example.warehouse.dto.request.InventoryRequest;
import com.example.warehouse.dto.response.InventoryResponse;
import com.example.warehouse.dto.wrapper.PageResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.InventoryService;
import com.example.warehouse.util.PageUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@Validated
@Tag(name = "Inventory", description = "Inventory management endpoints")
public class InventoryController {

        private final InventoryService inventoryService;

        public InventoryController(InventoryService inventoryService) {
                this.inventoryService = inventoryService;
        }

        @PostMapping
        @PreAuthorize("hasAnyAuthority('ADMIN', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        @Operation(summary = "Create inventory")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Inventory created", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                                        {"status":201,"message":"Inventory created successfully","data":{"inventoryId":"1de59d85-7f60-4548-b20a-cc9f3c73afec","blockId":"bf5a0a76-3f7e-4764-a987-40d7d8fdd920","blockName":"Room A1","quantity":120,"reservedQuantity":0,"damagedQuantity":0,"availableQuantity":120,"minStockLevel":20,"maxStockLevel":500,"isLowStock":false}}
                                        """))),
                        @ApiResponse(responseCode = "400", description = "Validation failed")
        })
        public ResponseEntity<ResponseStructure<InventoryResponse>> createInventory(
                        @Valid @RequestBody InventoryRequest request) {
                InventoryResponse response = inventoryService.createInventory(request);
                ResponseStructure<InventoryResponse> structure = new ResponseStructure<>(
                                HttpStatus.CREATED.value(),
                                "Inventory created successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.CREATED);
        }

        @PutMapping("/{inventoryId}")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'WAREHOUSE_MANAGER', 'SUPERVISOR')")
        public ResponseEntity<ResponseStructure<InventoryResponse>> updateInventory(
                        @PathVariable String inventoryId,
                        @Valid @RequestBody InventoryRequest request) {
                InventoryResponse response = inventoryService.updateInventory(inventoryId, request);
                ResponseStructure<InventoryResponse> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Inventory updated successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @PutMapping("/{inventoryId}/adjust")
        @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERVISOR', 'WAREHOUSE_MANAGER')")
        public ResponseEntity<ResponseStructure<InventoryResponse>> adjustStock(
                        @PathVariable String inventoryId,
                        @RequestParam @NotNull @Positive Integer quantityChange) {
                InventoryResponse response = inventoryService.adjustStock(inventoryId, quantityChange);
                ResponseStructure<InventoryResponse> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Stock adjusted successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping("/{inventoryId}")
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        public ResponseEntity<ResponseStructure<InventoryResponse>> getInventoryById(@PathVariable String inventoryId) {
                InventoryResponse response = inventoryService.getInventoryById(inventoryId);
                ResponseStructure<InventoryResponse> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Inventory retrieved successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping("/block/{blockId}")
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        public ResponseEntity<ResponseStructure<List<InventoryResponse>>> getInventoriesByBlock(
                        @PathVariable String blockId) {
                List<InventoryResponse> response = inventoryService.getInventoriesByBlock(blockId);
                ResponseStructure<List<InventoryResponse>> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Inventories retrieved successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping(value = "/block/{blockId}", params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        public ResponseEntity<ResponseStructure<PageResponse<InventoryResponse>>> getInventoriesByBlockPaged(
                        @PathVariable String blockId, Pageable pageable) {
                List<InventoryResponse> response = inventoryService.getInventoriesByBlock(blockId);
                PageResponse<InventoryResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(response, pageable));
                ResponseStructure<PageResponse<InventoryResponse>> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Inventories retrieved successfully",
                                pageResponse);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping("/product/{productId}")
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        public ResponseEntity<ResponseStructure<List<InventoryResponse>>> getInventoriesByProduct(
                        @PathVariable String productId) {
                List<InventoryResponse> response = inventoryService.getInventoriesByProduct(productId);
                ResponseStructure<List<InventoryResponse>> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Inventories retrieved successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping(value = "/product/{productId}", params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        public ResponseEntity<ResponseStructure<PageResponse<InventoryResponse>>> getInventoriesByProductPaged(
                        @PathVariable String productId, Pageable pageable) {
                List<InventoryResponse> response = inventoryService.getInventoriesByProduct(productId);
                PageResponse<InventoryResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(response, pageable));
                ResponseStructure<PageResponse<InventoryResponse>> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Inventories retrieved successfully",
                                pageResponse);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        @Operation(summary = "List all inventory")
        @ApiResponse(responseCode = "200", description = "Inventories retrieved", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                        {"status":200,"message":"Inventories retrieved successfully","data":[{"inventoryId":"1de59d85-7f60-4548-b20a-cc9f3c73afec","blockId":"bf5a0a76-3f7e-4764-a987-40d7d8fdd920","blockName":"Room A1","quantity":120,"reservedQuantity":0,"damagedQuantity":0,"availableQuantity":120,"minStockLevel":20,"maxStockLevel":500,"isLowStock":false}]}
                        """)))
        public ResponseEntity<ResponseStructure<List<InventoryResponse>>> getAllInventories() {
                List<InventoryResponse> response = inventoryService.getAllInventories();
                ResponseStructure<List<InventoryResponse>> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Inventories retrieved successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping(params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        public ResponseEntity<ResponseStructure<PageResponse<InventoryResponse>>> getAllInventoriesPaged(
                        Pageable pageable) {
                List<InventoryResponse> response = inventoryService.getAllInventories();
                PageResponse<InventoryResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(response, pageable));
                ResponseStructure<PageResponse<InventoryResponse>> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Inventories retrieved successfully",
                                pageResponse);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping("/low-stock")
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        public ResponseEntity<ResponseStructure<List<InventoryResponse>>> getLowStockItems() {
                List<InventoryResponse> response = inventoryService.getLowStockItems();
                ResponseStructure<List<InventoryResponse>> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Low stock items retrieved successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping(value = "/low-stock", params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        public ResponseEntity<ResponseStructure<PageResponse<InventoryResponse>>> getLowStockItemsPaged(
                        Pageable pageable) {
                List<InventoryResponse> response = inventoryService.getLowStockItems();
                PageResponse<InventoryResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(response, pageable));
                ResponseStructure<PageResponse<InventoryResponse>> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Low stock items retrieved successfully",
                                pageResponse);
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

        @PostMapping("/{inventoryId}/restore")
        @PreAuthorize("hasAuthority('ADMIN')")
        public ResponseEntity<ResponseStructure<InventoryResponse>> restoreInventory(@PathVariable String inventoryId) {
                InventoryResponse response = inventoryService.restoreInventory(inventoryId);
                ResponseStructure<InventoryResponse> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Inventory restored successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }
}
