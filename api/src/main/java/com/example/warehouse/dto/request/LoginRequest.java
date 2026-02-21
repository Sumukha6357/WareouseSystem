package com.example.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String identifier, // email or username
        @NotBlank String password) {
}
