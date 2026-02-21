package com.example.warehouse.controller;

import com.example.warehouse.dto.request.LoginRequest;
import com.example.warehouse.dto.response.LoginResponse;
import com.example.warehouse.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.warehouse.dto.wrapper.ResponseStructure;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long expirationMs;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    /**
     * POST /login
     * Accepts email/username + password, returns a JWT Bearer token.
     */
    @PostMapping("/login")
    public ResponseEntity<ResponseStructure<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.identifier(), request.password()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("");

        LoginResponse loginResponse = new LoginResponse(token, role, userDetails.getUsername(), expirationMs);
        ResponseStructure<LoginResponse> structure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Login successful",
                loginResponse);

        return ResponseEntity.ok(structure);
    }
}
