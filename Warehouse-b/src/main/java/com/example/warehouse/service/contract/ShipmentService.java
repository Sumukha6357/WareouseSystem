package com.example.warehouse.service.contract;

import com.example.warehouse.entity.Shipment;
import com.example.warehouse.entity.ShipmentStatus;
import com.example.warehouse.dto.request.CreateShipmentRequest;
import java.util.List;

public interface ShipmentService {
    Shipment createShipment(CreateShipmentRequest request);

    Shipment getShipmentById(String shipmentId);

    Shipment getShipmentByCode(String shipmentCode);

    List<Shipment> getShipmentsByOrderId(String orderId);

    List<Shipment> getShipmentsByStatus(ShipmentStatus status);

    List<Shipment> getActiveShipments();

    Shipment updateShipmentStatus(String shipmentId, ShipmentStatus status, String location, String notes);

    Shipment assignShipper(String shipmentId, String shipperId);

    void deleteShipment(String shipmentId);
}
