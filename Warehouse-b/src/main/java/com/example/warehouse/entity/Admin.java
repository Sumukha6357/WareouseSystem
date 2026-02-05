package com.example.warehouse.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Admin extends User {

    @ManyToOne
    @JoinColumn(name = "warehouse_id", nullable = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private WareHouse warehouse;
}
