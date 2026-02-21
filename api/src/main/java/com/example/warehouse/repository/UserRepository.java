package com.example.warehouse.repository;

import com.example.warehouse.enums.UserRole;
import com.example.warehouse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmailOrUsername(String email, String username);

    Optional<User> findByUsername(String username);

    List<User> findByUserRole(UserRole userRole);

    default Optional<User> searchUserByIdentifier(String identifier) {
        return findByEmailOrUsername(identifier, identifier);
    }
}
