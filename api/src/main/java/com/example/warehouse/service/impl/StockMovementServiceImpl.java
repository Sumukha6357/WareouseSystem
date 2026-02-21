package com.example.warehouse.service.impl;

import com.example.warehouse.dto.request.StockMovementRequest;
import com.example.warehouse.dto.response.ProductResponse;
import com.example.warehouse.dto.response.StockMovementResponse;
import com.example.warehouse.entity.Block;
import com.example.warehouse.entity.MovementType;
import com.example.warehouse.entity.Product;
import com.example.warehouse.entity.StockMovement;
import com.example.warehouse.repository.BlockRepository;
import com.example.warehouse.repository.ProductRepository;
import com.example.warehouse.repository.StockMovementRepository;
import com.example.warehouse.service.contract.StockMovementService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class StockMovementServiceImpl implements StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;
    private final BlockRepository blockRepository;

    public StockMovementServiceImpl(StockMovementRepository stockMovementRepository,
            ProductRepository productRepository,
            BlockRepository blockRepository) {
        this.stockMovementRepository = stockMovementRepository;
        this.productRepository = productRepository;
        this.blockRepository = blockRepository;
    }

    @Override
    @Transactional
    public StockMovementResponse recordMovement(StockMovementRequest request, String username) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setQuantity(request.getQuantity());
        movement.setMovementType(MovementType.valueOf(request.getMovementType()));
        movement.setReferenceType(request.getReferenceType());
        movement.setReferenceId(request.getReferenceId());
        movement.setNotes(request.getNotes());
        movement.setNotes(request.getNotes());
        movement.setCreatedBy(username);
        movement.setWarehouseId(com.example.warehouse.config.WarehouseContext.getWarehouseId());

        // Set from block if provided
        if (request.getFromBlockId() != null) {
            Block fromBlock = blockRepository.findById(request.getFromBlockId())
                    .orElseThrow(() -> new RuntimeException("From block not found"));
            movement.setFromBlock(fromBlock);
        }

        // Set to block if provided
        if (request.getToBlockId() != null) {
            Block toBlock = blockRepository.findById(request.getToBlockId())
                    .orElseThrow(() -> new RuntimeException("To block not found"));
            movement.setToBlock(toBlock);
        }

        StockMovement savedMovement = stockMovementRepository.save(movement);
        return mapToResponse(savedMovement);
    }

    @Override
    public StockMovementResponse getMovementById(String movementId) {
        StockMovement movement = stockMovementRepository.findById(movementId)
                .orElseThrow(() -> new RuntimeException("Movement not found"));
        return mapToResponse(movement);
    }

    @Override
    public List<StockMovementResponse> getMovementsByProduct(String productId) {
        return stockMovementRepository.findByProductProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StockMovementResponse> getMovementsByBlock(String blockId) {
        return stockMovementRepository.findByBlockId(blockId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StockMovementResponse> getMovementsByType(String movementType) {
        MovementType type = MovementType.valueOf(movementType);
        return stockMovementRepository.findByMovementTypeOrderByCreatedAtDesc(type).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StockMovementResponse> getRecentMovements(int limit) {
        return stockMovementRepository.findRecentMovements().stream()
                .limit(limit)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StockMovementResponse> getMovementsByUser(String username) {
        return stockMovementRepository.findByCreatedByOrderByCreatedAtDesc(username).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StockMovementResponse> getAllMovements() {
        return stockMovementRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private StockMovementResponse mapToResponse(StockMovement movement) {
        StockMovementResponse response = new StockMovementResponse();
        response.setMovementId(movement.getMovementId());

        // Map product
        ProductResponse productResponse = new ProductResponse();
        productResponse.setProductId(movement.getProduct().getProductId());
        productResponse.setName(movement.getProduct().getName());
        productResponse.setSku(movement.getProduct().getSku());
        productResponse.setCategory(movement.getProduct().getCategory());
        response.setProduct(productResponse);

        // Map from block
        if (movement.getFromBlock() != null) {
            response.setFromBlockId(movement.getFromBlock().getBlockId());
            response.setFromBlockName(
                    movement.getFromBlock().getRoom() != null
                            ? movement.getFromBlock().getRoom().getName() + " - Block"
                            : "Block " + movement.getFromBlock().getBlockId().substring(0, 8));
        }

        // Map to block
        if (movement.getToBlock() != null) {
            response.setToBlockId(movement.getToBlock().getBlockId());
            response.setToBlockName(
                    movement.getToBlock().getRoom() != null
                            ? movement.getToBlock().getRoom().getName() + " - Block"
                            : "Block " + movement.getToBlock().getBlockId().substring(0, 8));
        }

        response.setQuantity(movement.getQuantity());
        response.setMovementType(movement.getMovementType().name());
        response.setReferenceType(movement.getReferenceType());
        response.setReferenceId(movement.getReferenceId());
        response.setNotes(movement.getNotes());
        response.setCreatedBy(movement.getCreatedBy());
        response.setCreatedAt(movement.getCreatedAt() != null ? movement.getCreatedAt().toEpochMilli() : null);

        return response;
    }
}
