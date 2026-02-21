package com.example.warehouse.entity;

public enum MovementType {
    INBOUND, // Receiving stock from supplier
    PUTAWAY, // Moving stock to storage location
    PICK, // Picking stock for order
    TRANSFER, // Moving stock between blocks
    ADJUSTMENT, // Stock count adjustment (damage, loss, found)
    OUTBOUND // Shipping stock to customer
}
