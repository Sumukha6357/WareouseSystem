package com.example.warehouse.repository;

import com.example.warehouse.entity.Shipper;
import com.example.warehouse.entity.ShipperType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipperRepository extends JpaRepository<Shipper, String> {

    List<Shipper> findByActiveOrderByNameAsc(Boolean active);

    List<Shipper> findByTypeAndActiveOrderByNameAsc(ShipperType type, Boolean active);

    List<Shipper> findByNameContainingIgnoreCaseOrderByNameAsc(String name);

    List<Shipper> findByType(ShipperType type);

    List<Shipper> findByActiveTrue();
}
