package com.example.warehouse.controller;

import com.example.warehouse.dto.request.ProductRequest;
import com.example.warehouse.dto.response.ProductResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<ProductResponse>> createProduct(@RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        ResponseStructure<ProductResponse> structure = new ResponseStructure<>(
                HttpStatus.CREATED.value(),
                "Product created successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.CREATED);
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<ProductResponse>> updateProduct(
            @PathVariable String productId,
            @RequestBody ProductRequest request) {
        ProductResponse response = productService.updateProduct(productId, request);
        ResponseStructure<ProductResponse> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Product updated successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ResponseStructure<ProductResponse>> getProductById(@PathVariable String productId) {
        ProductResponse response = productService.getProductById(productId);
        ResponseStructure<ProductResponse> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Product retrieved successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ResponseStructure<ProductResponse>> getProductBySku(@PathVariable String sku) {
        ProductResponse response = productService.getProductBySku(sku);
        ResponseStructure<ProductResponse> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Product retrieved successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ResponseStructure<List<ProductResponse>>> getAllProducts() {
        List<ProductResponse> response = productService.getAllProducts();
        ResponseStructure<List<ProductResponse>> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Products retrieved successfully",
                response);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseStructure<String>> deleteProduct(@PathVariable String productId) {
        productService.deleteProduct(productId);
        ResponseStructure<String> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Product deleted successfully",
                null);
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }
}
