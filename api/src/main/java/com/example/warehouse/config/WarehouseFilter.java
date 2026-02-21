package com.example.warehouse.config;

import com.example.warehouse.entity.Admin;
import com.example.warehouse.entity.Staff;
import com.example.warehouse.entity.User;
import com.example.warehouse.enums.UserRole;
import com.example.warehouse.repository.AdminRepository;
import com.example.warehouse.repository.StaffRepository;
import com.example.warehouse.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class WarehouseFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final StaffRepository staffRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated()) {
                String username = authentication.getName();
                // JWT principal is the user's email — use the same lookup as authentication
                Optional<User> userOpt = userRepository.searchUserByIdentifier(username);

                if (userOpt.isPresent()) {
                    User user = userOpt.get();

                    if (user.getUserRole() == UserRole.ADMIN) {
                        // Admins can override warehouse via header
                        String headerId = request.getHeader("X-Warehouse-Id");
                        if (headerId != null && !headerId.isEmpty()) {
                            WarehouseContext.setWarehouseId(headerId);
                        } else {
                            // Default to admin's assigned warehouse if any
                            adminRepository.findById(user.getUserId())
                                    .ifPresent(admin -> {
                                        if (admin.getWarehouse() != null) {
                                            WarehouseContext.setWarehouseId(admin.getWarehouse().getWarehouseId());
                                        }
                                    });
                        }
                    } else {
                        // Staff are locked to their assigned warehouse
                        staffRepository.findById(user.getUserId())
                                .ifPresent(staff -> {
                                    if (staff.getWarehouse() != null) {
                                        WarehouseContext.setWarehouseId(staff.getWarehouse().getWarehouseId());
                                    }
                                });
                    }
                }
            }

            filterChain.doFilter(request, response);
        } finally {
            WarehouseContext.clear();
        }
    }
}
