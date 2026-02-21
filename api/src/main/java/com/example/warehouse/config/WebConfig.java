package com.example.warehouse.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final @org.springframework.lang.NonNull LatencyInterceptor latencyInterceptor;

    public WebConfig(@org.springframework.lang.NonNull LatencyInterceptor latencyInterceptor) {
        this.latencyInterceptor = latencyInterceptor;
    }

    @Override
    public void addInterceptors(@org.springframework.lang.NonNull InterceptorRegistry registry) {
        registry.addInterceptor(latencyInterceptor);
    }
}
