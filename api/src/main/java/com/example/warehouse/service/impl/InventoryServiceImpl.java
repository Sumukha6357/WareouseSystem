package com.example.warehouse.service.impl;

import com.example.warehouse.dto.request.InventoryRequest;
import com.example.warehouse.dto.response.InventoryResponse;
import com.example.warehouse.dto.response.ProductResponse;
import com.example.warehouse.entity.Block;
import com.example.warehouse.entity.Inventory;
import com.example.warehouse.entity.Product;
import com.example.warehouse.repository.BlockRepository;
import com.example.warehouse.repository.InventoryRepository;
import com.example.warehouse.repository.ProductRepository;
import com.example.warehouse.service.contract.InventoryService;
import com.example.warehouse.exception.InsufficientCapacityException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class InventoryServiceImpl implements InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryServiceImpl.class);

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final BlockRepository blockRepository;
    private final com.example.warehouse.service.contract.StockMovementService stockMovementService;

    public InventoryServiceImpl(InventoryRepository inventoryRepository,
            ProductRepository productRepository,
            BlockRepository blockRepository,
            com.example.warehouse.service.contract.StockMovementService stockMovementService) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.blockRepository = blockRepository;
        this.stockMovementService = stockMovementService;
    }

    @Override
    public InventoryResponse createInventory(InventoryRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Block block = blockRepository.findById(request.getBlockId())
                .orElseThrow(() -> new RuntimeException("Block not found"));

        // Check if inventory already exists for this product-block combination
        inventoryRepository.findByProductProductIdAndBlockBlockId(
                request.getProductId(), request.getBlockId()).ifPresent(inv -> {
                    throw new RuntimeException("Inventory already exists for this product in this block");
                });

        if (block.getAvailableCapacity() < request.getQuantity()) {
            throw new InsufficientCapacityException("Insufficient capacity in block: " + block.getName());
        }

        Inventory inventory = new Inventory();
        inventory.setProduct(product);
        inventory.setBlock(block);
        inventory.setQuantity(request.getQuantity());
        inventory.setReservedQuantity(0);
        inventory.setDamagedQuantity(0);
        inventory.setMinStockLevel(request.getMinStockLevel());
        inventory.setMaxStockLevel(request.getMaxStockLevel());
        inventory.setWarehouseId(com.example.warehouse.config.WarehouseContext.getWarehouseId());

        Inventory savedInventory = inventoryRepository.save(inventory);
        return mapToResponse(savedInventory);
    }

    @Override
    public InventoryResponse updateInventory(String inventoryId, InventoryRequest request) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .filter(i -> !i.isDeleted())
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        inventory.setQuantity(request.getQuantity());
        inventory.setMinStockLevel(request.getMinStockLevel());
        inventory.setMaxStockLevel(request.getMaxStockLevel());

        Inventory updatedInventory = inventoryRepository.save(inventory);
        return mapToResponse(updatedInventory);
    }

    @Override
    public InventoryResponse getInventoryById(String inventoryId) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .filter(i -> !i.isDeleted())
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
        return mapToResponse(inventory);
    }

    @Override
    public List<InventoryResponse> getInventoriesByBlock(String blockId) {
        return inventoryRepository.findByBlockBlockId(blockId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> getInventoriesByProduct(String productId) {
        return inventoryRepository.findByProductProductId(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> getAllInventories() {
        return inventoryRepository.findAll(
                new com.example.warehouse.repository.specification.SpecificationBuilder<Inventory>().build())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> getLowStockItems() {
        return inventoryRepository.findLowStockItems().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteInventory(String inventoryId) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
        inventory.setDeleted(true);
        inventory.setDeletedAt(java.time.Instant.now());
        inventoryRepository.save(inventory);
    }

    @Override
    public InventoryResponse restoreInventory(String inventoryId) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
        inventory.setDeleted(false);
        inventory.setDeletedAt(null);
        Inventory savedInventory = inventoryRepository.save(inventory);
        return mapToResponse(savedInventory);
    }

    @Override
    public InventoryResponse adjustStock(String inventoryId, Integer quantityChange) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        int quantityChangeVal = quantityChange != null ? quantityChange : 0;
        int newQuantity = inventory.getQuantity() + quantityChangeVal;

        if (newQuantity < 0) {
            throw new RuntimeException("Cannot reduce stock below zero");
        }

        if (quantityChangeVal > 0 && inventory.getBlock().getAvailableCapacity() < quantityChangeVal) {
            throw new InsufficientCapacityException(
                    "Insufficient capacity in block: " + inventory.getBlock().getName());
        }

        inventory.setQuantity(newQuantity);
        Inventory updatedInventory = inventoryRepository.save(inventory);

        // Record stock movement for audit trail
        com.example.warehouse.dto.request.StockMovementRequest movementRequest = new com.example.warehouse.dto.request.StockMovementRequest();
        movementRequest.setProductId(inventory.getProduct().getProductId());
        movementRequest.setToBlockId(inventory.getBlock().getBlockId());
        movementRequest.setQuantity(Math.abs(quantityChange));
        movementRequest.setMovementType(quantityChange > 0 ? "INBOUND" : "ADJUSTMENT");
        movementRequest.setReferenceType("ADJUSTMENT");
        movementRequest.setNotes(quantityChange > 0
                ? "Stock increased by " + quantityChange
                : "Stock decreased by " + Math.abs(quantityChange));

        try {
            stockMovementService.recordMovement(movementRequest, "SYSTEM");
        } catch (Exception e) {
            // Log but don't fail the stock adjustment
            log.error("Failed to record movement for inventory {}", inventoryId, e);
        }

        return mapToResponse(updatedInventory);
    }

    private InventoryResponse mapToResponse(Inventory inventory) {
        InventoryResponse response = new InventoryResponse();
        response.setInventoryId(inventory.getInventoryId());

        // Map product
        ProductResponse productResponse = new ProductResponse();
        productResponse.setProductId(inventory.getProduct().getProductId());
        productResponse.setName(inventory.getProduct().getName());
        productResponse.setDescription(inventory.getProduct().getDescription());
        productResponse.setSku(inventory.getProduct().getSku());
        productResponse.setCategory(inventory.getProduct().getCategory());
        productResponse.setUnitPrice(inventory.getProduct().getUnitPrice());
        productResponse.setWeight(inventory.getProduct().getWeight());
        productResponse.setDimensions(inventory.getProduct().getDimensions());
        response.setProduct(productResponse);

        response.setBlockId(inventory.getBlock().getBlockId());
        response.setBlockName(
                inventory.getBlock().getRoom() != null ? inventory.getBlock().getRoom().getName() : "Unknown");
        response.setQuantity(inventory.getQuantity());
        response.setReservedQuantity(inventory.getReservedQuantity());
        response.setDamagedQuantity(inventory.getDamagedQuantity());
        response.setAvailableQuantity(inventory.getAvailableQuantity());
        response.setMinStockLevel(inventory.getMinStockLevel());
        response.setMaxStockLevel(inventory.getMaxStockLevel());

        // Check if low stock
        boolean isLowStock = inventory.getMinStockLevel() != null &&
                inventory.getQuantity() <= inventory.getMinStockLevel();
        response.setIsLowStock(isLowStock);

        response.setCreatedAt(inventory.getCreatedAt() != null ? inventory.getCreatedAt().toEpochMilli() : null);
        response.setLastModifiedAt(
                inventory.getLastModifiedAt() != null ? inventory.getLastModifiedAt().toEpochMilli() : null);

        return response;
    }
}
