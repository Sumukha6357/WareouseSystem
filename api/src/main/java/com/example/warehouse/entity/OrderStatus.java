package com.example.warehouse.entity;

public enum OrderStatus {
    PENDING, // Order created, awaiting pick assignment
    PICK_ASSIGNED, // Pick tasks assigned to pickers
    PICKED, // All items picked
    PACKED, // Order packed and ready to ship
    DISPATCHED, // Order shipped/dispatched
    CANCELLED // Order cancelled
}
