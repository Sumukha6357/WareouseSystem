package com.example.warehouse.dto.wrapper;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

public record ApiErrorResponse(
        @Schema(example = "2026-02-19T12:34:56Z")
        Instant timestamp,
        @Schema(example = "400")
        int status,
        @Schema(example = "Bad Request")
        String error,
        @Schema(example = "Validation failed")
        String message,
        @Schema(example = "/orders")
        String path) {
}
