package com.example.warehouse.dto.response;

public record LoginResponse(
        String token,
        String role,
        String email,
        long expiresInMs) {
}
