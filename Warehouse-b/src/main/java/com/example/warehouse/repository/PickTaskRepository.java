package com.example.warehouse.repository;

import com.example.warehouse.entity.PickTask;
import com.example.warehouse.entity.PickTaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickTaskRepository extends JpaRepository<PickTask, String> {

    List<PickTask> findByOrderOrderIdOrderByCreatedAtAsc(String orderId);

    List<PickTask> findByAssignedToAndStatusOrderByCreatedAtAsc(String assignedTo, PickTaskStatus status);

    List<PickTask> findByAssignedToOrderByCreatedAtDesc(String assignedTo);

    List<PickTask> findByStatusOrderByCreatedAtAsc(PickTaskStatus status);

    List<PickTask> findByProductProductIdOrderByCreatedAtDesc(String productId);

    List<PickTask> findByBlockBlockIdOrderByCreatedAtDesc(String blockId);
}
