
package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@Table(name = "shipment")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "shipment_id", nullable = false, updatable = false)
    private String shipmentId;

    @Column(name = "shipment_code", unique = true, nullable = false)
    private String shipmentCode;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "shipper_id", nullable = false)
    private Shipper shipper;

    @Column(name = "warehouse_id")
    private String warehouseId; // Simplified to String ID for now

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ShipmentStatus status = ShipmentStatus.CREATED;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "estimated_delivery_date")
    private LocalDate estimatedDeliveryDate;

    @Column(name = "notes")
    private String notes;

    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL)
    private List<ShipmentItem> shipmentItems;

    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL)
    private List<ShipmentEvent> events;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "last_modified_at", nullable = false)
    private Instant lastModifiedAt;

    @Column(name = "dispatched_at")
    private Instant dispatchedAt;

    @Column(name = "delivered_at")
    private Instant deliveredAt;
}
