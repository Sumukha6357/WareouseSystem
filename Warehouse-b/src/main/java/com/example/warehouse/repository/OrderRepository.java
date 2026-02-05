package com.example.warehouse.repository;

import com.example.warehouse.entity.Order;
import com.example.warehouse.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByCustomerNameContainingIgnoreCaseOrderByCreatedAtDesc(String customerName);

    long countByStatusNotIn(List<OrderStatus> statuses);

    // Analytics: Find stuck orders (older than 24h and not COMPLETED/CANCELLED)
    @Query("SELECT o FROM Order o WHERE o.status NOT IN ('DELIVERED', 'CANCELLED', 'RETURNED') AND o.createdAt < ?1")
    List<Order> findStuckOrders(java.time.Instant olderThan);
}
