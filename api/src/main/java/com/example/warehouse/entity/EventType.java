package com.example.warehouse.entity;

public enum EventType {
    PICKED, // Items picked from warehouse
    PACKED, // Items packed
    LOADED, // Loaded onto vehicle
    DISPATCHED, // Left warehouse
    LOCATION_UPDATE, // GPS location update
    DELIVERED, // Delivered to customer
    FAILED, // Delivery attempt failed
    RETURNED // Returned to warehouse
}
