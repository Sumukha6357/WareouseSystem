package com.example.warehouse.service.impl;

import com.example.warehouse.dto.request.ProductRequest;
import com.example.warehouse.dto.response.ProductResponse;
import com.example.warehouse.entity.Product;
import com.example.warehouse.repository.ProductRepository;
import com.example.warehouse.service.contract.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("Product with SKU " + request.getSku() + " already exists");
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setCategory(request.getCategory());
        product.setUnitPrice(request.getUnitPrice());
        product.setWeight(request.getWeight());
        product.setDimensions(request.getDimensions());

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    @Override
    public ProductResponse updateProduct(String productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setUnitPrice(request.getUnitPrice());
        product.setWeight(request.getWeight());
        product.setDimensions(request.getDimensions());

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    @Override
    public ProductResponse getProductById(String productId) {
        Product product = productRepository.findById(productId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return mapToResponse(product);
    }

    @Override
    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository
                .findAll(new com.example.warehouse.repository.specification.SpecificationBuilder<Product>().build())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteProduct(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        product.setDeleted(true);
        product.setDeletedAt(java.time.Instant.now());
        productRepository.save(product);
    }

    @Override
    public ProductResponse restoreProduct(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        product.setDeleted(false);
        product.setDeletedAt(null);
        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setProductId(product.getProductId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setSku(product.getSku());
        response.setCategory(product.getCategory());
        response.setUnitPrice(product.getUnitPrice());
        response.setWeight(product.getWeight());
        response.setDimensions(product.getDimensions());
        response.setCreatedAt(product.getCreatedAt() != null ? product.getCreatedAt().toEpochMilli() : null);
        response.setLastModifiedAt(
                product.getLastModifiedAt() != null ? product.getLastModifiedAt().toEpochMilli() : null);
        return response;
    }
}
