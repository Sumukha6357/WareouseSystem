package com.example.warehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private String productId;
    private String name;
    private String description;
    private String sku;
    private String category;
    private Double unitPrice;
    private Double weight;
    private String dimensions;
    private Long createdAt;
    private Long lastModifiedAt;
}
