package com.example.warehouse.repository;

import com.example.warehouse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmailOrUsername(String email, String username);

    default Optional<User> searchUserByIdentifier(String identifier) {
        return findByEmailOrUsername(identifier, identifier);
    }
}
