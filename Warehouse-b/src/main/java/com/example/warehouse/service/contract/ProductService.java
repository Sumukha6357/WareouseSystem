package com.example.warehouse.service.contract;

import com.example.warehouse.dto.request.ProductRequest;
import com.example.warehouse.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(String productId, ProductRequest request);

    ProductResponse getProductById(String productId);

    ProductResponse getProductBySku(String sku);

    List<ProductResponse> getAllProducts();

    void deleteProduct(String productId);
}
