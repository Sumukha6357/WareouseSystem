package com.example.warehouse.entity;

import com.example.warehouse.enums.BlockType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "block")
@Inheritance(strategy = InheritanceType.JOINED)
public class Block extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Room room;

    @Column(name = "warehouse_id")
    private String warehouseId;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "block", cascade = CascadeType.ALL)
    private List<Inventory> inventories = new ArrayList<>();

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "block_id", nullable = false, updatable = false)
    private String blockId;

    @Column(name = "height", nullable = false)
    private double height;

    @Column(name = "length", nullable = false)
    private double length;

    @Column(name = "breath", nullable = false)
    private double breath;

    @Column(name = "type", nullable = false)
    private BlockType type;

    // Calculate total capacity in cubic meters
    public double getTotalCapacity() {
        return height * length * breath;
    }

    // Calculate occupied capacity (simplified - assumes each item takes 1 cubic
    // meter)
    public double getOccupiedCapacity() {
        if (inventories == null || inventories.isEmpty()) {
            return 0.0;
        }
        return inventories.stream()
                .mapToDouble(inv -> inv.getQuantity() != null ? inv.getQuantity() : 0)
                .sum();
    }

    // Calculate available capacity
    public double getAvailableCapacity() {
        return getTotalCapacity() - getOccupiedCapacity();
    }

    // Calculate utilization percentage
    public double getUtilizationPercentage() {
        double totalCapacity = getTotalCapacity();
        if (totalCapacity == 0) {
            return 0.0;
        }
        return (getOccupiedCapacity() / totalCapacity) * 100;
    }
}
