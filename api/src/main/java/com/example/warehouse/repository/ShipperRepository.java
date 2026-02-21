package com.example.warehouse.repository;

import com.example.warehouse.entity.Shipper;
import com.example.warehouse.entity.ShipperType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipperRepository extends JpaRepository<Shipper, String>,
        org.springframework.data.jpa.repository.JpaSpecificationExecutor<Shipper> {

    List<Shipper> findByActiveOrderByNameAsc(Boolean active);

    List<Shipper> findByTypeAndActiveOrderByNameAsc(ShipperType type, Boolean active);

    List<Shipper> findByNameContainingIgnoreCaseOrderByNameAsc(String name);

    List<Shipper> findByType(ShipperType type);

    List<Shipper> findByActiveTrue();

    Page<Shipper> findByType(ShipperType type, Pageable pageable);

    Page<Shipper> findByActiveTrue(Pageable pageable);
}
