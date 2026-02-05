package com.example.warehouse.controller;

import com.example.warehouse.dto.request.AdminUserUpdateRequest;
import com.example.warehouse.dto.request.UserRegistrationRequest;
import com.example.warehouse.dto.request.UserRequest;
import com.example.warehouse.dto.response.UserResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseStructure<UserResponse>> addUser(@RequestBody UserRegistrationRequest urr) {
        UserResponse ur = userService.addUser(urr);
        ResponseStructure<UserResponse> responseStructure = new ResponseStructure<>(HttpStatus.CREATED.value(),
                "User Successfully Added Into the Database", ur);
        return new ResponseEntity<>(responseStructure, HttpStatus.CREATED);
    }

    @PutMapping("/users")
    public ResponseEntity<ResponseStructure<UserResponse>> updateUser(@RequestBody UserRequest request) {
        UserResponse userResponse = userService.updateUser(request);
        ResponseStructure<UserResponse> responseStructure = new ResponseStructure<>(HttpStatus.OK.value(),
                "Update Details Update Successfully", userResponse);

        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ResponseStructure<UserResponse>> findUserById(@PathVariable String userId) {
        UserResponse userResponse = userService.findUserById(userId);
        ResponseStructure<UserResponse> responseStructure = new ResponseStructure<>(HttpStatus.OK.value(),
                "User Find By Respected Id", userResponse);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @GetMapping("/users/me")
    public ResponseEntity<ResponseStructure<UserResponse>> getAuthenticatedUser(java.security.Principal principal) {
        UserResponse userResponse = userService.findUserByEmail(principal.getName());
        ResponseStructure<UserResponse> responseStructure = new ResponseStructure<>(HttpStatus.OK.value(),
                "Authenticated User Profile", userResponse);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ResponseStructure<UserResponse>> deleteUserById(@PathVariable String userId) {
        UserResponse userResponse = userService.deleteUserById(userId);
        ResponseStructure<UserResponse> responseStructure = new ResponseStructure<>(HttpStatus.OK.value(),
                "User Deleted!!", userResponse);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<ResponseStructure<java.util.List<UserResponse>>> findAllUsers() {
        java.util.List<UserResponse> users = userService.findAllUsers();
        ResponseStructure<java.util.List<UserResponse>> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "All Users Found", users);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/users/{userId}")
    public ResponseEntity<ResponseStructure<UserResponse>> adminUpdateUser(
            @PathVariable String userId,
            @RequestBody AdminUserUpdateRequest request) {

        // Ensure the userId from the path is used in the request object if missing
        AdminUserUpdateRequest updatedRequest = request;
        if (request.userId() == null || request.userId().isBlank()) {
            updatedRequest = new AdminUserUpdateRequest(
                    userId,
                    request.username(),
                    request.email(),
                    request.userRole(),
                    request.mobile(),
                    request.profileImage());
        }

        UserResponse userResponse = userService.adminUpdateUser(updatedRequest);
        ResponseStructure<UserResponse> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "User Updated Successfully", userResponse);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }
}
