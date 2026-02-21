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
import com.example.warehouse.exception.UserNotFoundByEmail;
import com.example.warehouse.exception.UserNotFoundByIdException;
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
        if (role == UserRole.ADMIN) {
            user = userMapper.userToEntity(urr, new Admin());
        } else {
            // All other roles use the Staff entity for warehouse context
            user = userMapper.userToEntity(urr, new Staff());
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

        // Only update password if a new one is provided in the request
        if (request.password() != null && !request.password().isBlank()) {
            String encodedPassword = passwordEncoder.encode(request.password());
            user.setPassword(encodedPassword);
        }

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
        user.setMobile(request.mobile());
        user.setProfileImage(request.profileImage());

        // Update role if changed — compare enums directly, not strings
        if (request.userRole() != null) {
            UserRole newRole;
            try {
                newRole = UserRole.valueOf(request.userRole().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Invalid role: " + request.userRole());
            }

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
            newUser.setMobile(request.mobile());
            newUser.setProfileImage(request.profileImage());
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
        return userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .map(userMapper::userToResponse)
                .orElseThrow(() -> new UserNotFoundByIdException("User Not Found Based On Id!!"));
    }

    @Override
    public UserResponse findUserByEmail(String email) {
        return userRepository.searchUserByIdentifier(email)
                .filter(u -> !u.isDeleted())
                .map(userMapper::userToResponse)
                .orElseThrow(() -> new UserNotFoundByEmail("User Not Found By Email!!"));
    }

    @Override
    public UserResponse deleteUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundByIdException("UserId Not Found!!"));
        user.setDeleted(true);
        user.setDeletedAt(java.time.Instant.now());
        userRepository.save(user);
        return userMapper.userToResponse(user);
    }

    @Override
    public java.util.List<UserResponse> findAllUsers() {
        return userRepository.findAll(
                new com.example.warehouse.repository.specification.SpecificationBuilder<User>().build())
                .stream().map(userMapper::userToResponse).toList();
    }

    @Override
    public UserResponse restoreUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundByIdException("UserId Not Found!!"));
        user.setDeleted(false);
        user.setDeletedAt(null);
        userRepository.save(user);
        return userMapper.userToResponse(user);
    }
}
