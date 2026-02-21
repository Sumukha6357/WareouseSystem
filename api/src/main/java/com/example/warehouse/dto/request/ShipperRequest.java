package com.example.warehouse.dto.request;

import com.example.warehouse.entity.ServiceLevel;
import com.example.warehouse.entity.ShipperType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ShipperRequest(
        @NotBlank @Size(max = 120) String name,
        @NotNull ShipperType type,
        @NotNull ServiceLevel serviceLevel,
        @Size(max = 255) String trackingUrlTemplate,
        @Size(max = 255) String contactDetails,
        Boolean active) {
}
