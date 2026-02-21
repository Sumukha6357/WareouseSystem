package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Getter
@Setter
@Table(name = "inventory")
public class Inventory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "inventory_id", nullable = false, updatable = false)
    private String inventoryId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "block_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Block block;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "warehouse_id")
    private String warehouseId;

    @Column(name = "reserved_quantity")
    private Integer reservedQuantity = 0;

    @Column(name = "damaged_quantity")
    private Integer damagedQuantity = 0;

    @Column(name = "min_stock_level")
    private Integer minStockLevel;

    @Column(name = "max_stock_level")
    private Integer maxStockLevel;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    // Helper method to get available quantity
    public Integer getAvailableQuantity() {
        int reserved = reservedQuantity != null ? reservedQuantity : 0;
        int damaged = damagedQuantity != null ? damagedQuantity : 0;
        return quantity - reserved - damaged;
    }
}
