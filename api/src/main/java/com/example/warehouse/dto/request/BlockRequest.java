package com.example.warehouse.dto.request;

import com.example.warehouse.enums.BlockType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record BlockRequest(
        @Positive double height,
        @Positive double length,
        @Positive double breath,
        @NotNull BlockType type
) {
}
