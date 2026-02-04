package com.example.warehouse.repository;

import com.example.warehouse.entity.MovementType;
import com.example.warehouse.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, String> {

    // Find movements by product
    List<StockMovement> findByProductProductIdOrderByCreatedAtDesc(String productId);

    // Find movements by block (either from or to)
    @Query("SELECT sm FROM StockMovement sm WHERE sm.fromBlock.blockId = ?1 OR sm.toBlock.blockId = ?1 ORDER BY sm.createdAt DESC")
    List<StockMovement> findByBlockId(String blockId);

    // Find movements by type
    List<StockMovement> findByMovementTypeOrderByCreatedAtDesc(MovementType movementType);

    // Find recent movements (activity feed)
    @Query("SELECT sm FROM StockMovement sm ORDER BY sm.createdAt DESC")
    List<StockMovement> findRecentMovements();

    // Find movements by date range
    List<StockMovement> findByCreatedAtBetweenOrderByCreatedAtDesc(Instant startDate, Instant endDate);

    // Find movements by user
    List<StockMovement> findByCreatedByOrderByCreatedAtDesc(String createdBy);

    // Find movements by reference
    List<StockMovement> findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc(String referenceType, String referenceId);
}
