package com.example.warehouse.entity;

public enum ShipmentStatus {
    CREATED, // Shipment created
    PICKED, // Items picked from warehouse
    PACKED, // Items packed and labeled
    READY_TO_DISPATCH, // Ready for pickup/dispatch
    DISPATCHED, // Handed over to carrier
    IN_TRANSIT, // On the way to customer
    DELIVERED, // Successfully delivered
    FAILED, // Delivery failed
    RETURNED // Returned to warehouse
}
