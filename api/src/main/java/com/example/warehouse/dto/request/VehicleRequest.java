package com.example.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VehicleRequest(
        @NotBlank @Size(max = 64) String vehicleNumber,
        @Size(max = 120) String driverName,
        @Size(max = 32) String driverPhone) {
}

