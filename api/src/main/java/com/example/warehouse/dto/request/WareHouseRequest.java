package com.example.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WareHouseRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Size(max = 120) String city,
        @NotBlank @Size(max = 500) String address,
        @NotBlank @Size(max = 120) String landmark
) {
}
