package com.example.warehouse.repository;

import com.example.warehouse.entity.Shipment;
import com.example.warehouse.entity.ShipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, String>, JpaSpecificationExecutor<Shipment> {

    @Query("SELECT s FROM Shipment s WHERE s.deleted = false AND s.shipmentCode = :shipmentCode AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    Optional<Shipment> findByShipmentCode(String shipmentCode);

    @Query("SELECT s FROM Shipment s WHERE s.deleted = false AND s.order.orderId = :orderId AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY s.createdAt DESC")
    List<Shipment> findByOrderOrderIdOrderByCreatedAtDesc(String orderId);

    @Query("SELECT s FROM Shipment s WHERE s.deleted = false AND s.order.orderId = :orderId AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY s.createdAt DESC")
    Page<Shipment> findByOrderOrderIdOrderByCreatedAtDesc(String orderId, Pageable pageable);

    @Query("SELECT s FROM Shipment s WHERE s.deleted = false AND s.status = :status AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY s.createdAt DESC")
    List<Shipment> findByStatusOrderByCreatedAtDesc(ShipmentStatus status);

    @Query("SELECT s FROM Shipment s WHERE s.deleted = false AND s.status = :status AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY s.createdAt DESC")
    Page<Shipment> findByStatusOrderByCreatedAtDesc(ShipmentStatus status, Pageable pageable);

    @Query("SELECT s FROM Shipment s WHERE s.deleted = false AND s.shipper.shipperId = :shipperId AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY s.createdAt DESC")
    List<Shipment> findByShipperShipperIdOrderByCreatedAtDesc(String shipperId);

    // This method already filtered by warehouseId, but we can enforce context or
    // keep it explicit if used by internal batch processes
    List<Shipment> findByWarehouseIdOrderByCreatedAtDesc(String warehouseId);

    @Query("SELECT s FROM Shipment s WHERE s.deleted = false AND s.status IN ('IN_TRANSIT', 'DISPATCHED') AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY s.dispatchedAt DESC")
    List<Shipment> findActiveShipments();

    @Query("SELECT s FROM Shipment s WHERE s.deleted = false AND s.status IN ('IN_TRANSIT', 'DISPATCHED') AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    Page<Shipment> findActiveShipments(Pageable pageable);

    @Query("SELECT s FROM Shipment s WHERE s.deleted = false AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY s.createdAt DESC")
    List<Shipment> findAllByOrderByCreatedAtDesc();

    @Query("SELECT s FROM Shipment s WHERE s.deleted = false AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY s.createdAt DESC")
    Page<Shipment> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COUNT(s) FROM Shipment s WHERE s.deleted = false AND s.status = :status AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    long countByStatus(ShipmentStatus status);

    @Query("SELECT COUNT(s) FROM Shipment s WHERE s.deleted = false AND s.status IN :statuses AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    long countByStatusIn(List<ShipmentStatus> statuses);

    @Query("SELECT COUNT(s) FROM Shipment s WHERE s.deleted = false AND s.status = :status AND s.deliveredAt BETWEEN :start AND :end AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    long countByStatusAndDeliveredAtBetween(ShipmentStatus status, Instant start, Instant end);

    @Query("SELECT COUNT(s) FROM Shipment s WHERE s.deleted = false AND s.status = 'DELIVERED' AND s.deliveredAt >= ?1 AND s.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    long countDeliveredSince(Instant since);
}
