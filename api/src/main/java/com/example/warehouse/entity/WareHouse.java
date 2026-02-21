package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@Entity
@Table(name = "warehouse")
public class WareHouse extends BaseEntity {

    @OneToMany(mappedBy = "warehouse")
    private List<Staff> staff = new ArrayList<>();

    @OneToMany(mappedBy = "warehouse")
    private List<Admin> admin = new ArrayList<>();

    @OneToMany(mappedBy = "warehouse")
    private List<Room> room = new ArrayList<>();

    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    @Column(name = "warehouse_id", nullable = false, updatable = false)
    private String warehouseId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "city", nullable = false, updatable = false)
    private String city;

    @Column(name = "address", nullable = false, updatable = false)
    private String address;// Co-ordinate also for use distance calculation

    @Column(name = "landmark", nullable = false, updatable = false)
    private String landmark;
}
