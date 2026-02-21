package com.example.warehouse.repository;

import com.example.warehouse.entity.MovementType;
import com.example.warehouse.entity.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, String>, JpaSpecificationExecutor<StockMovement> {

    // Find movements by product
    @Query("SELECT sm FROM StockMovement sm WHERE sm.deleted = false AND sm.product.productId = :productId AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY sm.createdAt DESC")
    List<StockMovement> findByProductProductIdOrderByCreatedAtDesc(String productId);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.deleted = false AND sm.product.productId = :productId AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY sm.createdAt DESC")
    Page<StockMovement> findByProductProductIdOrderByCreatedAtDesc(String productId, Pageable pageable);

    // Find movements by block (either from or to)
    @Query("SELECT sm FROM StockMovement sm WHERE (sm.deleted = false AND sm.fromBlock.blockId = :blockId OR sm.toBlock.blockId = :blockId) AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY sm.createdAt DESC")
    List<StockMovement> findByBlockId(@org.springframework.data.repository.query.Param("blockId") String blockId);

    @Query("SELECT sm FROM StockMovement sm WHERE (sm.deleted = false AND sm.fromBlock.blockId = :blockId OR sm.toBlock.blockId = :blockId) AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    Page<StockMovement> findByBlockId(@org.springframework.data.repository.query.Param("blockId") String blockId,
            Pageable pageable);

    // Find movements by type
    @Query("SELECT sm FROM StockMovement sm WHERE sm.deleted = false AND sm.movementType = :movementType AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY sm.createdAt DESC")
    List<StockMovement> findByMovementTypeOrderByCreatedAtDesc(MovementType movementType);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.deleted = false AND sm.movementType = :movementType AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY sm.createdAt DESC")
    Page<StockMovement> findByMovementTypeOrderByCreatedAtDesc(MovementType movementType, Pageable pageable);

    // Find recent movements (activity feed)
    @Query("SELECT sm FROM StockMovement sm WHERE sm.deleted = false AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY sm.createdAt DESC")
    List<StockMovement> findRecentMovements();

    @Query("SELECT sm FROM StockMovement sm WHERE sm.deleted = false AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY sm.createdAt DESC")
    Page<StockMovement> findRecentMovements(Pageable pageable);

    // Find movements by date range
    @Query("SELECT sm FROM StockMovement sm WHERE sm.deleted = false AND sm.createdAt BETWEEN :startDate AND :endDate AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY sm.createdAt DESC")
    List<StockMovement> findByCreatedAtBetweenOrderByCreatedAtDesc(Instant startDate, Instant endDate);

    // Find movements by user
    @Query("SELECT sm FROM StockMovement sm WHERE sm.deleted = false AND sm.createdBy = :createdBy AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY sm.createdAt DESC")
    List<StockMovement> findByCreatedByOrderByCreatedAtDesc(String createdBy);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.deleted = false AND sm.createdBy = :createdBy AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY sm.createdAt DESC")
    Page<StockMovement> findByCreatedByOrderByCreatedAtDesc(String createdBy, Pageable pageable);

    // Find movements by reference
    @Query("SELECT sm FROM StockMovement sm WHERE sm.deleted = false AND sm.referenceType = :referenceType AND sm.referenceId = :referenceId AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY sm.createdAt DESC")
    List<StockMovement> findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc(String referenceType, String referenceId);

    // Analytics: Top Movers (High turnover products)
    @Query("SELECT new com.example.warehouse.dto.analytics.StockTurnoverResponse(sm.product.productId, sm.product.name, COUNT(sm), 0.0) "
            + "FROM StockMovement sm "
            + "WHERE sm.deleted = false AND sm.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} "
            + "GROUP BY sm.product.productId, sm.product.name "
            + "ORDER BY COUNT(sm) DESC")
    List<com.example.warehouse.dto.analytics.StockTurnoverResponse> findTopMovers();
}
