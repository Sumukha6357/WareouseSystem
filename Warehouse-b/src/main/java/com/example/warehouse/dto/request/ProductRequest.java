package com.example.warehouse.dto.request;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private String sku;
    private String category;
    private Double unitPrice;
    private Double weight;
    private String dimensions;
}
