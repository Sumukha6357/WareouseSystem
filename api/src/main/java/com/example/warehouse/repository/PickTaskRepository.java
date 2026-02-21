package com.example.warehouse.repository;

import com.example.warehouse.entity.PickTask;
import com.example.warehouse.entity.PickTaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface PickTaskRepository extends JpaRepository<PickTask, String>, JpaSpecificationExecutor<PickTask> {

    @Query("SELECT p FROM PickTask p WHERE p.deleted = false AND p.order.orderId = :orderId AND p.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY p.createdAt ASC")
    List<PickTask> findByOrderOrderIdOrderByCreatedAtAsc(String orderId);

    @Query("SELECT p FROM PickTask p WHERE p.deleted = false AND p.order.orderId = :orderId AND p.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY p.createdAt ASC")
    Page<PickTask> findByOrderOrderIdOrderByCreatedAtAsc(String orderId, Pageable pageable);

    @Query("SELECT p FROM PickTask p WHERE p.deleted = false AND p.assignedTo = :assignedTo AND p.status = :status AND p.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY p.createdAt ASC")
    List<PickTask> findByAssignedToAndStatusOrderByCreatedAtAsc(String assignedTo, PickTaskStatus status);

    @Query("SELECT p FROM PickTask p WHERE p.deleted = false AND p.assignedTo = :assignedTo AND p.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY p.createdAt DESC")
    List<PickTask> findByAssignedToOrderByCreatedAtDesc(String assignedTo);

    @Query("SELECT p FROM PickTask p WHERE p.deleted = false AND p.assignedTo = :assignedTo AND p.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY p.createdAt DESC")
    Page<PickTask> findByAssignedToOrderByCreatedAtDesc(String assignedTo, Pageable pageable);

    @Query("SELECT p FROM PickTask p WHERE p.deleted = false AND p.status = :status AND p.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY p.createdAt ASC")
    List<PickTask> findByStatusOrderByCreatedAtAsc(PickTaskStatus status);

    @Query("SELECT p FROM PickTask p WHERE p.deleted = false AND p.product.productId = :productId AND p.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY p.createdAt DESC")
    List<PickTask> findByProductProductIdOrderByCreatedAtDesc(String productId);

    @Query("SELECT p FROM PickTask p WHERE p.deleted = false AND p.block.blockId = :blockId AND p.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY p.createdAt DESC")
    List<PickTask> findByBlockBlockIdOrderByCreatedAtDesc(String blockId);

    @Query("SELECT COUNT(p) FROM PickTask p WHERE p.deleted = false AND p.assignedTo = :assignedTo AND p.status IN :statuses AND p.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    long countByAssignedToAndStatusIn(String assignedTo, List<PickTaskStatus> statuses);

    @Query("SELECT COUNT(p) FROM PickTask p WHERE p.deleted = false AND p.assignedTo = :assignedTo AND p.status = :status AND p.completedAt BETWEEN :start AND :end AND p.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    long countByAssignedToAndStatusAndCompletedAtBetween(String assignedTo, PickTaskStatus status, Instant start,
            Instant end);

    @Query("SELECT COUNT(p) FROM PickTask p WHERE p.deleted = false AND p.block.blockId = :blockId AND p.status IN :statuses AND p.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    long countByBlockBlockIdAndStatusIn(String blockId, List<PickTaskStatus> statuses);
}
