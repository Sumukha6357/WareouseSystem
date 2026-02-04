package com.example.warehouse.service.impl;

import com.example.warehouse.dto.mapper.UserMapper;
import com.example.warehouse.dto.request.AdminUserUpdateRequest;
import com.example.warehouse.dto.request.UserRegistrationRequest;
import com.example.warehouse.dto.request.UserRequest;
import com.example.warehouse.dto.response.UserResponse;
import com.example.warehouse.entity.Admin;
import com.example.warehouse.entity.Staff;
import com.example.warehouse.entity.User;
import com.example.warehouse.enums.UserRole;
import com.example.warehouse.exceptions.UserNotFoundByEmail;
import com.example.warehouse.exceptions.UserNotFoundByIdException;
import com.example.warehouse.repository.UserRepository;
import com.example.warehouse.service.contract.UserService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.example.warehouse.security.AuthUtils.*;

@Service
@SuppressWarnings("null")
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse addUser(UserRegistrationRequest urr) {

        UserRole role = urr.userRole();
        User user;
        if (role == UserRole.STAFF) {
            user = userMapper.userToEntity(urr, new Staff());
        } else if (role == UserRole.ADMIN) {
            user = userMapper.userToEntity(urr, new Admin());
        } else {
            throw new IllegalArgumentException("Unsupported role: " + role);
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        userRepository.save(user);
        return userMapper.userToResponse(user);
    }

    @Override
    public UserResponse updateUser(UserRequest request) {

        User exUser = getCurrentUserName()
                .map(username -> userRepository.searchUserByIdentifier(username)
                        .orElseThrow(() -> new UserNotFoundByEmail("User not found by id")))
                .orElseThrow(() -> new UserNotFoundByEmail("User is not Authorized"));

        User user = userMapper.requestToEntity(request, exUser);
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);
        return userMapper.userToResponse(user);
    }

    @Override
    public UserResponse adminUpdateUser(AdminUserUpdateRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new UserNotFoundByIdException("User not found by id"));

        // Update basic fields
        user.setUsername(request.username());
        user.setEmail(request.email());

        // Update role if changed
        if (request.userRole() != null && !request.userRole().equals(user.getUserRole().name())) {
            UserRole newRole = UserRole.valueOf(request.userRole());

            // Create new user instance with correct type based on role
            User newUser;
            if (newRole == UserRole.ADMIN) {
                newUser = new Admin();
            } else {
                newUser = new Staff();
            }

            // Copy all fields from old user to new user
            newUser.setUserId(user.getUserId());
            newUser.setUsername(request.username());
            newUser.setEmail(request.email());
            newUser.setPassword(user.getPassword());
            newUser.setUserRole(newRole);
            newUser.setCreatedAt(user.getCreatedAt());

            // Delete old user and save new one
            userRepository.delete(user);
            userRepository.save(newUser);
            return userMapper.userToResponse(newUser);
        }

        // If role didn't change, just update and save
        userRepository.save(user);
        return userMapper.userToResponse(user);
    }

    @Override
    public UserResponse findUserById(String userId) {
        return userRepository.findById(userId).map(userMapper::userToResponse)
                .orElseThrow(() -> new UserNotFoundByIdException("User Not Found Based On Id!!"));
    }

    @Override
    public UserResponse findUserByEmail(String email) {
        return userRepository.searchUserByIdentifier(email).map(userMapper::userToResponse)
                .orElseThrow(() -> new UserNotFoundByEmail("User Not Found By Email!!"));
    }

    @Override
    public UserResponse deleteUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundByIdException("UserId Not Found!!"));
        userRepository.delete(user);
        return userMapper.userToResponse(user);
    }

    @Override
    public java.util.List<UserResponse> findAllUsers() {
        return userRepository.findAll().stream().map(userMapper::userToResponse).toList();
    }
}
