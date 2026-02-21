package com.example.warehouse.repository;

import com.example.warehouse.entity.ShipmentEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipmentEventRepository extends JpaRepository<ShipmentEvent, String>, JpaSpecificationExecutor<ShipmentEvent> {

    @Query("SELECT se FROM ShipmentEvent se WHERE se.deleted = false AND se.shipment.shipmentId = :shipmentId AND se.shipment.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY se.createdAt ASC")
    List<ShipmentEvent> findByShipmentShipmentIdOrderByCreatedAtAsc(String shipmentId);

    @Query("SELECT se FROM ShipmentEvent se WHERE se.deleted = false AND se.shipment.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()} ORDER BY se.createdAt DESC")
    List<ShipmentEvent> findTop100ByOrderByCreatedAtDesc();
}
