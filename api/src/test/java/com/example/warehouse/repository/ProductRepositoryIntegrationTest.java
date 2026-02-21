package com.example.warehouse.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.warehouse.entity.Product;
import com.example.warehouse.support.AbstractIntegrationTest;

@SpringBootTest
class ProductRepositoryIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
    }

    @Test
    void findBySku_returnsPersistedProduct() {
        Product product = new Product();
        product.setName("Test Product");
        product.setSku("SKU-IT-001");
        product.setCategory("TEST");
        product.setUnitPrice(100.0);
        productRepository.save(product);

        Optional<Product> found = productRepository.findBySku("SKU-IT-001");

        assertTrue(found.isPresent());
        assertEquals("Test Product", found.get().getName());
        assertEquals("SKU-IT-001", found.get().getSku());
    }
}
