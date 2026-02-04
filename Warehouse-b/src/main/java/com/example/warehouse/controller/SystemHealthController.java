package com.example.warehouse.controller;

import com.example.warehouse.dto.response.SystemHealthResponse;
import com.example.warehouse.service.impl.SystemStatusService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class SystemHealthController {

    private final SystemStatusService systemStatusService;

    public SystemHealthController(SystemStatusService systemStatusService) {
        this.systemStatusService = systemStatusService;
    }

    @GetMapping("/stats")
    public SystemHealthResponse getSystemHealth() {
        return systemStatusService.getSystemHealth();
    }
}
