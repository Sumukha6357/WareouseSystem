package com.example.warehouse.dto.wrapper;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PUBLIC)
@Schema(description = "Standard API response wrapper")
public class ResponseStructure<T>{
    @Schema(example = "200")
    private int status;
    @Schema(example = "Request completed successfully")
    private String message;
    private T data;
}
