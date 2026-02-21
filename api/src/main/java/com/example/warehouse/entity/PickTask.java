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
@EntityListeners(AuditingEntityListener.class)
@Table(name = "pick_task")
public class PickTask extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "task_id", nullable = false, updatable = false)
    private String taskId;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "block_id", nullable = false)
    private Block block;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "warehouse_id")
    private String warehouseId;

    @Column(name = "assigned_to")
    private String assignedTo; // Username of picker

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PickTaskStatus status = PickTaskStatus.ASSIGNED;

    @Column(name = "notes")
    private String notes;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}
