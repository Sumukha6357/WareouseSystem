package com.example.warehouse.repository;

import com.example.warehouse.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, String> {
    List<Inventory> findByBlockBlockId(String blockId);

    List<Inventory> findByProductProductId(String productId);

    Optional<Inventory> findByProductProductIdAndBlockBlockId(String productId, String blockId);

    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.minStockLevel")
    List<Inventory> findLowStockItems();
}
