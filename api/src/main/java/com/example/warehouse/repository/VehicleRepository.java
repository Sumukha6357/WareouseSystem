package com.example.warehouse.repository;

import com.example.warehouse.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String>, JpaSpecificationExecutor<Vehicle> {

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);

    List<Vehicle> findByActiveOrderByVehicleNumberAsc(Boolean active);

    List<Vehicle> findByShipperShipperIdAndActiveOrderByVehicleNumberAsc(String shipperId, Boolean active);

    List<Vehicle> findByActiveTrue();

    Page<Vehicle> findByActiveTrue(Pageable pageable);
}
