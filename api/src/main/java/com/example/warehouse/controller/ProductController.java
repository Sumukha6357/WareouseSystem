package com.example.warehouse.controller;

import com.example.warehouse.dto.request.ProductRequest;
import com.example.warehouse.dto.response.ProductResponse;
import com.example.warehouse.dto.wrapper.PageResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.ProductService;
import com.example.warehouse.util.PageUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@Validated
@Tag(name = "Products", description = "Product catalog endpoints")
public class ProductController {

        private final ProductService productService;

        public ProductController(ProductService productService) {
                this.productService = productService;
        }

        @PostMapping
        @PreAuthorize("hasAuthority('ADMIN')")
        @Operation(summary = "Create product")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Product created", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                                        {"status":201,"message":"Product created successfully","data":{"productId":"a8b6d4f1-9f7b-4ab5-a668-cf1cb4f0e2d2","name":"Premium Tape","description":"Industrial packaging tape","sku":"TAPE-PRM-001","category":"Packaging","unitPrice":9.99,"weight":0.25,"dimensions":"10x5x2 cm","createdAt":1739635200000,"lastModifiedAt":1739635200000}}
                                        """))),
                        @ApiResponse(responseCode = "400", description = "Validation failed")
        })
        public ResponseEntity<ResponseStructure<ProductResponse>> createProduct(
                        @Valid @RequestBody ProductRequest request) {
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
                        @Valid @RequestBody ProductRequest request) {
                ProductResponse response = productService.updateProduct(productId, request);
                ResponseStructure<ProductResponse> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Product updated successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping("/{productId}")
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        public ResponseEntity<ResponseStructure<ProductResponse>> getProductById(@PathVariable String productId) {
                ProductResponse response = productService.getProductById(productId);
                ResponseStructure<ProductResponse> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Product retrieved successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping("/sku/{sku}")
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        public ResponseEntity<ResponseStructure<ProductResponse>> getProductBySku(@PathVariable String sku) {
                ProductResponse response = productService.getProductBySku(sku);
                ResponseStructure<ProductResponse> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Product retrieved successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        @Operation(summary = "List products")
        @ApiResponse(responseCode = "200", description = "Products retrieved", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                        {"status":200,"message":"Products retrieved successfully","data":[{"productId":"a8b6d4f1-9f7b-4ab5-a668-cf1cb4f0e2d2","name":"Premium Tape","description":"Industrial packaging tape","sku":"TAPE-PRM-001","category":"Packaging","unitPrice":9.99,"weight":0.25,"dimensions":"10x5x2 cm","createdAt":1739635200000,"lastModifiedAt":1739635200000}]}
                        """)))
        public ResponseEntity<ResponseStructure<List<ProductResponse>>> getAllProducts() {
                List<ProductResponse> response = productService.getAllProducts();
                ResponseStructure<List<ProductResponse>> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Products retrieved successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        @GetMapping(params = { "page", "size" })
        @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','WAREHOUSE_MANAGER','SUPERVISOR')")
        public ResponseEntity<ResponseStructure<PageResponse<ProductResponse>>> getAllProductsPaged(Pageable pageable) {
                List<ProductResponse> response = productService.getAllProducts();
                PageResponse<ProductResponse> pageResponse = PageUtils
                                .toPageResponse(PageUtils.paginate(response, pageable));
                ResponseStructure<PageResponse<ProductResponse>> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Products retrieved successfully",
                                pageResponse);
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

        @PostMapping("/{productId}/restore")
        @PreAuthorize("hasAuthority('ADMIN')")
        public ResponseEntity<ResponseStructure<ProductResponse>> restoreProduct(@PathVariable String productId) {
                ProductResponse response = productService.restoreProduct(productId);
                ResponseStructure<ProductResponse> structure = new ResponseStructure<>(
                                HttpStatus.OK.value(),
                                "Product restored successfully",
                                response);
                return new ResponseEntity<>(structure, HttpStatus.OK);
        }
}
