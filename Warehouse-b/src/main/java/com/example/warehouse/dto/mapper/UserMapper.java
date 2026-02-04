package com.example.warehouse.dto.mapper;

import com.example.warehouse.dto.request.UserRegistrationRequest;
import com.example.warehouse.dto.request.UserRequest;
import com.example.warehouse.dto.response.UserResponse;
import com.example.warehouse.dto.response.WareHouseResponse;

import com.example.warehouse.entity.User;
import com.example.warehouse.entity.Admin;
import com.example.warehouse.entity.Staff;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    private final WareHouseMapper wareHouseMapper;

    public UserMapper(WareHouseMapper wareHouseMapper) {
        this.wareHouseMapper = wareHouseMapper;
    }

    public User userToEntity(UserRegistrationRequest source, User target) {
        target.setUsername(source.username());
        target.setEmail(source.email());
        target.setPassword(source.password());
        target.setUserRole(source.userRole());// problem
        return target;
    }

    public UserResponse userToResponse(User user) {
        WareHouseResponse warehouseResponse = null;
        if (user instanceof Admin admin) {
            warehouseResponse = wareHouseMapper.toResponse(admin.getWarehouse());
        } else if (user instanceof Staff staff) {
            warehouseResponse = wareHouseMapper.toResponse(staff.getWarehouse());
        }

        return new UserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getUserRole().name(),
                user.getCreatedAt().toEpochMilli(),
                user.getLastModifiedAt().toEpochMilli(),
                warehouseResponse);
    }

    public User requestToEntity(UserRequest request, User target) {
        target.setUsername(request.username());
        target.setEmail(request.email());
        target.setPassword(request.password());
        return target;
    }

}
