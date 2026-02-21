package com.example.warehouse.dto.response;

import com.example.warehouse.entity.ServiceLevel;
import com.example.warehouse.entity.ShipperType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ShipperResponse {
    private String shipperId;
    private String name;
    private ShipperType type;
    private ServiceLevel serviceLevel;
    private String trackingUrlTemplate;
    private String contactDetails;
    private Boolean active;
    private Instant createdAt;
    private Instant lastModifiedAt;
}

