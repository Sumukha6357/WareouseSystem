package com.example.warehouse.repository;

import com.example.warehouse.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends JpaRepository<Staff, String>, JpaSpecificationExecutor<Staff> {
}
