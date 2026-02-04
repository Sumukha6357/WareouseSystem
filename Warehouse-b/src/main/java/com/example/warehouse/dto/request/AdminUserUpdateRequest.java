package com.example.warehouse.dto.request;

public record AdminUserUpdateRequest(
        String userId,
        String username,
        String email,
        String userRole) {
}
