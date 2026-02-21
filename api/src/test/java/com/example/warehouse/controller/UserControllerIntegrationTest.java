package com.example.warehouse.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.warehouse.enums.UserRole;
import com.example.warehouse.repository.UserRepository;
import com.example.warehouse.support.AbstractIntegrationTest;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void register_createsUserInDatabase() throws Exception {
        RegisterUserPayload payload = new RegisterUserPayload(
                "integration_user",
                "integration_user@test.com",
                "Password@123",
                UserRole.STAFF.name(),
                "9999999999",
                null);

        mockMvc.perform(post("/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.data.email").value("integration_user@test.com"));

        boolean userCreated = userRepository.findByEmailOrUsername(
                "integration_user@test.com",
                "integration_user@test.com").isPresent();
        org.junit.jupiter.api.Assertions.assertTrue(userCreated);
    }

    private record RegisterUserPayload(
            String username,
            String email,
            String password,
            String userRole,
            String mobile,
            String profileImage) {
    }
}
