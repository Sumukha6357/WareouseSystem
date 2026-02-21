package com.example.warehouse.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.warehouse.dto.request.ProductRequest;
import com.example.warehouse.dto.response.ProductResponse;
import com.example.warehouse.repository.ProductRepository;
import com.example.warehouse.service.contract.ProductService;
import com.example.warehouse.support.AbstractIntegrationTest;

@SpringBootTest
class ProductServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
    }

    @Test
    void createProduct_persistsAndPreventsDuplicateSku() {
        ProductRequest request = new ProductRequest();
        request.setName("Service Product");
        request.setSku("SKU-SVC-001");
        request.setCategory("SERVICE_TEST");
        request.setUnitPrice(250.0);

        ProductResponse created = productService.createProduct(request);

        assertNotNull(created.getProductId());
        assertEquals("Service Product", created.getName());
        assertTrue(productRepository.existsBySku("SKU-SVC-001"));

        RuntimeException duplicateSkuError = assertThrows(RuntimeException.class,
                () -> productService.createProduct(request));
        assertTrue(duplicateSkuError.getMessage().contains("already exists"));
    }
}
