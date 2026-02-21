package com.example.warehouse.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI warehouseOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Warehouse Management API")
                        .version("v1")
                        .description("REST API for warehouse operations including inventory, orders, products, and shipments."));
    }
}
