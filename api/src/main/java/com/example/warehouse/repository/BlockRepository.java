package com.example.warehouse.repository;

import com.example.warehouse.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockRepository extends JpaRepository<Block, String>, JpaSpecificationExecutor<Block> {

    @Query("SELECT b FROM Block b WHERE b.deleted = false AND b.room.roomId = :roomId AND b.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    List<Block> findByRoomRoomId(String roomId);

    @Query("SELECT b FROM Block b WHERE b.deleted = false AND b.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    List<Block> findAll();

    @Query("SELECT b FROM Block b WHERE b.deleted = false AND b.blockId = :id AND b.warehouseId = :#{T(com.example.warehouse.config.WarehouseContext).getWarehouseId()}")
    Optional<Block> findById(String id);
}
