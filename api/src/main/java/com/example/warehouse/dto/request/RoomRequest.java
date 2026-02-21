package com.example.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RoomRequest(
        @NotBlank @Size(max = 120) String name
) {
}
