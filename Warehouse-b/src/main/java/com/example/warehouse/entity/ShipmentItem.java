package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "shipment_item")
public class ShipmentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "shipment_item_id", nullable = false, updatable = false)
    private String shipmentItemId;

    @ManyToOne
    @JoinColumn(name = "shipment_id", nullable = false)
    private Shipment shipment;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "block_id", nullable = false)
    private Block block;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;
}
