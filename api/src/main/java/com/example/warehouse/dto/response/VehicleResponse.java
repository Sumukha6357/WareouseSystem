package com.example.warehouse.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class VehicleResponse {
    private String vehicleId;
    private String vehicleNumber;
    private String driverName;
    private String driverPhone;
    private String shipperId;
    private Double lastLatitude;
    private Double lastLongitude;
    private Instant lastUpdatedAt;
    private Boolean active;
}

