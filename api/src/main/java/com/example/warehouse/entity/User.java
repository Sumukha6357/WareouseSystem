package com.example.warehouse.entity;

import com.example.warehouse.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    @Column(name = "user_id", nullable = false, updatable = false)
    private String userId;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "user_role", nullable = false, updatable = false)
    private UserRole userRole;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "profile_image")
    private String profileImage;

}
