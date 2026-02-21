package com.example.warehouse.service.contract;

import com.example.warehouse.dto.request.StockMovementRequest;
import com.example.warehouse.dto.response.StockMovementResponse;

import java.util.List;

public interface StockMovementService {

    // Record a stock movement
    StockMovementResponse recordMovement(StockMovementRequest request, String username);

    // Get movement by ID
    StockMovementResponse getMovementById(String movementId);

    // Get movements by product
    List<StockMovementResponse> getMovementsByProduct(String productId);

    // Get movements by block
    List<StockMovementResponse> getMovementsByBlock(String blockId);

    // Get movements by type
    List<StockMovementResponse> getMovementsByType(String movementType);

    // Get recent movements (activity feed)
    List<StockMovementResponse> getRecentMovements(int limit);

    // Get movements by user
    List<StockMovementResponse> getMovementsByUser(String username);

    // Get all movements
    List<StockMovementResponse> getAllMovements();
}
