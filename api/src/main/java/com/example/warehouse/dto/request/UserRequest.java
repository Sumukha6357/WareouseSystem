package com.example.warehouse.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequest(
                @NotBlank @Size(max = 120) String username,
                @NotBlank @Email @Size(max = 255) String email,
                @Size(max = 255) String password,
                @Size(max = 32) String mobile,
                @Size(max = 255) String profileImage) {
}
