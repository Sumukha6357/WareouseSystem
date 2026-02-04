package com.example.warehouse.repository;

import com.example.warehouse.entity.Order;
import com.example.warehouse.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByCustomerNameContainingIgnoreCaseOrderByCreatedAtDesc(String customerName);
}
