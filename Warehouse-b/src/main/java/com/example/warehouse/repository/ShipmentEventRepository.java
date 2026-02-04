package com.example.warehouse.repository;

import com.example.warehouse.entity.ShipmentEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipmentEventRepository extends JpaRepository<ShipmentEvent, String> {

    List<ShipmentEvent> findByShipmentShipmentIdOrderByCreatedAtAsc(String shipmentId);

    List<ShipmentEvent> findTop100ByOrderByCreatedAtDesc();
}
