package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@Table(name = "stock_movement")
public class StockMovement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "movement_id", nullable = false, updatable = false)
    private String movementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "warehouse_id")
    private String warehouseId;

    @ManyToOne
    @JoinColumn(name = "from_block_id")
    private Block fromBlock;

    @ManyToOne
    @JoinColumn(name = "to_block_id")
    private Block toBlock;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false)
    private MovementType movementType;

    @Column(name = "reference_type")
    private String referenceType; // PO, SO, TRANSFER, ADJUSTMENT

    @Column(name = "reference_id")
    private String referenceId;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_by")
    private String createdBy;

}
