package com.example.warehouse.config;

import com.example.warehouse.service.impl.SystemStatusService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class LatencyInterceptor implements HandlerInterceptor {

    private final SystemStatusService systemStatusService;

    public LatencyInterceptor(SystemStatusService systemStatusService) {
        this.systemStatusService = systemStatusService;
    }

    @Override
    public boolean preHandle(@org.springframework.lang.NonNull HttpServletRequest request,
            @org.springframework.lang.NonNull HttpServletResponse response,
            @org.springframework.lang.NonNull Object handler) {
        request.setAttribute("startTime", System.currentTimeMillis());
        return true;
    }

    @Override
    public void afterCompletion(@org.springframework.lang.NonNull HttpServletRequest request,
            @org.springframework.lang.NonNull HttpServletResponse response,
            @org.springframework.lang.NonNull Object handler,
            @org.springframework.lang.Nullable Exception ex) {
        Long startTime = (Long) request.getAttribute("startTime");
        if (startTime != null) {
            long duration = System.currentTimeMillis() - startTime;
            // Only tracking /api endpoints for meaningful latency
            if (request.getRequestURI().startsWith("/api")) {
                systemStatusService.updateLatency((double) duration);
            }
        }
    }
}
