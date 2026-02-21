package com.example.warehouse.controller;

import com.example.warehouse.entity.Product;
import com.example.warehouse.repository.ProductRepository;
import com.example.warehouse.support.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SoftDeleteIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void testProductSoftDeleteAndRestore() throws Exception {
        // 1. Create a product
        String payload = """
                {
                    "name": "Test Product",
                    "description": "Test Description",
                    "sku": "SKU-UNIT-TEST",
                    "category": "Test Category",
                    "unitPrice": 100.0,
                    "weight": 1.5,
                    "dimensions": "10x10x10"
                }
                """;

        MvcResult createResult = mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = createResult.getResponse().getContentAsString();
        String productId = objectMapper.readTree(responseBody).get("data").get("productId").asText();

        // 2. Verify product is in DB and NOT deleted
        Product product = productRepository.findById(productId).orElseThrow();
        assertFalse(product.isDeleted());
        assertNull(product.getDeletedAt());

        // 3. Delete the product (Soft Delete)
        mockMvc.perform(delete("/products/" + productId))
                .andExpect(status().isOk());

        // 4. Verify product is STILL in DB but marked as DELETED
        product = productRepository.findById(productId).orElseThrow();
        assertTrue(product.isDeleted());
        assertNotNull(product.getDeletedAt());

        // 5. Verify product is NOT returned by standard list query
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());

        // 6. Verify product is NOT returned by get by ID
        mockMvc.perform(get("/products/" + productId))
                .andExpect(status().isNotFound());

        // 7. Restore the product
        mockMvc.perform(post("/products/" + productId + "/restore"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.productId").value(productId));

        // 8. Verify product is marked as NOT DELETED
        product = productRepository.findById(productId).orElseThrow();
        assertFalse(product.isDeleted());
        assertNull(product.getDeletedAt());

        // 9. Verify product IS returned by standard list query again
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].productId").value(productId));
    }
}
