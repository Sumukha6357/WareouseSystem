package com.example.warehouse.dto.request;

import com.example.warehouse.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRegistrationRequest(
                @NotBlank @Size(max = 120) String username,
                @NotBlank @Email @Size(max = 255) String email,
                @NotBlank @Size(min = 8, max = 255) String password,
                @NotNull UserRole userRole,
                @Size(max = 32) String mobile,
                @Size(max = 255) String profileImage) {
}
