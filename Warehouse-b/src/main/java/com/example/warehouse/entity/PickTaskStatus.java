package com.example.warehouse.entity;

public enum PickTaskStatus {
    ASSIGNED, // Task assigned to picker
    IN_PROGRESS, // Picker started picking
    COMPLETED, // Picking completed
    CANCELLED // Task cancelled
}
