package com.example.warehouse.repository;

import com.example.warehouse.entity.Shipment;
import com.example.warehouse.entity.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, String> {

    Optional<Shipment> findByShipmentCode(String shipmentCode);

    List<Shipment> findByOrderOrderIdOrderByCreatedAtDesc(String orderId);

    List<Shipment> findByStatusOrderByCreatedAtDesc(ShipmentStatus status);

    List<Shipment> findByShipperShipperIdOrderByCreatedAtDesc(String shipperId);

    List<Shipment> findByWarehouseIdOrderByCreatedAtDesc(String warehouseId);

    @Query("SELECT s FROM Shipment s WHERE s.status IN ('IN_TRANSIT', 'DISPATCHED') ORDER BY s.dispatchedAt DESC")
    List<Shipment> findActiveShipments();

    List<Shipment> findAllByOrderByCreatedAtDesc();

    long countByStatus(ShipmentStatus status);

    long countByStatusIn(List<ShipmentStatus> statuses);

    @Query("SELECT COUNT(s) FROM Shipment s WHERE s.status = 'DELIVERED' AND s.deliveredAt >= ?1")
    long countDeliveredSince(java.time.Instant since);
}
