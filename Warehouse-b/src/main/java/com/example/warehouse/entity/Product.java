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
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "product_id", nullable = false, updatable = false)
    private String productId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "sku", unique = true, nullable = false)
    private String sku;

    @Column(name = "category")
    private String category;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "dimensions")
    private String dimensions; // Format: "LxWxH" in cm

    public double getVolume() {
        if (dimensions == null || dimensions.isEmpty()) {
            return 0.0;
        }
        try {
            String[] parts = dimensions.split("x");
            if (parts.length == 3) {
                double l = Double.parseDouble(parts[0].trim());
                double w = Double.parseDouble(parts[1].trim());
                double h = Double.parseDouble(parts[2].trim());
                // Return volume in cubic meters (assuming dims are in cm)
                return (l * w * h) / 1000000.0;
            }
        } catch (NumberFormatException e) {
            // ignore invalid formats
        }
        return 0.0;
    }

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "last_modified_at", nullable = false)
    private Instant lastModifiedAt;
}
