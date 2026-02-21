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
@Table(name = "shipper")
public class Shipper extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "shipper_id", nullable = false, updatable = false)
    private String shipperId;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ShipperType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_level", nullable = false)
    private ServiceLevel serviceLevel;

    @Column(name = "tracking_url_template")
    private String trackingUrlTemplate; // e.g., "https://delhivery.com/track/{trackingNumber}"

    @Column(name = "contact_details")
    private String contactDetails;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

}
