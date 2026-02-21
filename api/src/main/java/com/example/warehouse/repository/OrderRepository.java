package com.example.warehouse.repository;

import com.example.warehouse.entity.Order;
import com.example.warehouse.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {

    @Query("SELECT o FROM Order o WHERE o.deleted = false AND o.orderNumber = :orderNumber AND o.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    Optional<Order> findByOrderNumber(String orderNumber);

    @Query("SELECT o FROM Order o WHERE o.deleted = false AND o.status = :status AND o.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY o.createdAt DESC")
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.deleted = false AND o.status = :status AND o.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY o.createdAt DESC")
    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.deleted = false AND o.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY o.createdAt DESC")
    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT o FROM Order o WHERE o.deleted = false AND o.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY o.createdAt DESC")
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.deleted = false AND LOWER(o.customerName) LIKE LOWER(CONCAT('%', :customerName, '%')) AND o.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY o.createdAt DESC")
    List<Order> findByCustomerNameContainingIgnoreCaseOrderByCreatedAtDesc(String customerName);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.deleted = false AND o.status NOT IN :statuses AND o.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    long countByStatusNotIn(List<OrderStatus> statuses);

    // Analytics: Find stuck orders (older than 24h and not COMPLETED/CANCELLED)
    @Query("SELECT o FROM Order o WHERE o.deleted = false AND o.status NOT IN ('DELIVERED', 'CANCELLED', 'RETURNED') AND o.createdAt < ?1 AND o.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    List<Order> findStuckOrders(java.time.Instant olderThan);
}
