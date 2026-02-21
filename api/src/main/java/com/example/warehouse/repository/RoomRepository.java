package com.example.warehouse.repository;

import com.example.warehouse.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository
        extends JpaRepository<Room, String>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<Room> {

    @Query("SELECT r FROM Room r WHERE r.deleted = false AND r.warehouse.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    List<Room> findAll();

    @Query("SELECT r FROM Room r WHERE r.deleted = false AND r.roomId = :id AND r.warehouse.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    Optional<Room> findById(String id);
}
