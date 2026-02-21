package com.example.warehouse.repository;

import com.example.warehouse.entity.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, String>,
        org.springframework.data.jpa.repository.JpaSpecificationExecutor<Inventory> {

    @Query("SELECT i FROM Inventory i WHERE i.deleted = false AND i.block.blockId = :blockId AND i.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    List<Inventory> findByBlockBlockId(String blockId);

    @Query("SELECT i FROM Inventory i WHERE i.deleted = false AND i.block.blockId = :blockId AND i.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    Page<Inventory> findByBlockBlockId(String blockId, Pageable pageable);

    @Query("SELECT i FROM Inventory i WHERE i.deleted = false AND i.product.productId = :productId AND i.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    List<Inventory> findByProductProductId(String productId);

    @Query("SELECT i FROM Inventory i WHERE i.deleted = false AND i.product.productId = :productId AND i.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    Page<Inventory> findByProductProductId(String productId, Pageable pageable);

    @Query("SELECT i FROM Inventory i WHERE i.deleted = false AND i.product.productId = :productId AND i.block.blockId = :blockId AND i.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    Optional<Inventory> findByProductProductIdAndBlockBlockId(String productId, String blockId);

    @Query("SELECT i FROM Inventory i WHERE i.deleted = false AND i.quantity <= i.minStockLevel AND i.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    List<Inventory> findLowStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.deleted = false AND i.quantity <= i.minStockLevel AND i.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    Page<Inventory> findLowStockItems(Pageable pageable);
}
