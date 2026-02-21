package com.example.warehouse.service.contract;

import com.example.warehouse.dto.request.InventoryRequest;
import com.example.warehouse.dto.response.InventoryResponse;

import java.util.List;

public interface InventoryService {
    InventoryResponse createInventory(InventoryRequest request);

    InventoryResponse updateInventory(String inventoryId, InventoryRequest request);

    InventoryResponse getInventoryById(String inventoryId);

    List<InventoryResponse> getInventoriesByBlock(String blockId);

    List<InventoryResponse> getInventoriesByProduct(String productId);

    List<InventoryResponse> getAllInventories();

    List<InventoryResponse> getLowStockItems();

    InventoryResponse restoreInventory(String inventoryId);

    void deleteInventory(String inventoryId);

    InventoryResponse adjustStock(String inventoryId, Integer quantityChange);
}
