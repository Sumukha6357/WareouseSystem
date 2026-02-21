package com.example.warehouse.service.contract;

import com.example.warehouse.dto.request.AdminUserUpdateRequest;
import com.example.warehouse.dto.request.UserRegistrationRequest;
import com.example.warehouse.dto.request.UserRequest;
import com.example.warehouse.dto.response.UserResponse;

public interface UserService {
    UserResponse addUser(UserRegistrationRequest user);

    UserResponse updateUser(UserRequest request);

    UserResponse adminUpdateUser(AdminUserUpdateRequest request);

    UserResponse findUserById(String userId);

    UserResponse findUserByEmail(String email);

    UserResponse deleteUserById(String userId);

    java.util.List<UserResponse> findAllUsers();

    UserResponse restoreUser(String userId);
}
