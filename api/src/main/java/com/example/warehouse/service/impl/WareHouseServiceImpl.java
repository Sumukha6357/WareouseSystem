package com.example.warehouse.service.impl;

import com.example.warehouse.dto.mapper.WareHouseMapper;
import com.example.warehouse.dto.request.WareHouseRequest;
import com.example.warehouse.dto.response.WareHouseResponse;
import com.example.warehouse.entity.Admin;
import com.example.warehouse.entity.User;
import com.example.warehouse.entity.WareHouse;

import com.example.warehouse.exception.IllegalOperationException;
import com.example.warehouse.exception.UserNotFoundByIdException;
import com.example.warehouse.repository.UserRepository;
import com.example.warehouse.repository.WareHouseRepository;
import com.example.warehouse.service.contract.WareHouseService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@SuppressWarnings("null")
public class WareHouseServiceImpl implements WareHouseService {

    private final WareHouseRepository wareHouseRepository;
    private final UserRepository userRepository;
    private final WareHouseMapper wareHouseMapper;

    public WareHouseServiceImpl(WareHouseRepository wareHouseRepository, UserRepository userRepository,
            WareHouseMapper wareHouseMapper) {
        this.wareHouseRepository = wareHouseRepository;
        this.userRepository = userRepository;
        this.wareHouseMapper = wareHouseMapper;
    }

    @Override
    @Transactional
    public WareHouseResponse createWareHouse(WareHouseRequest wareHouseRequest, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundByIdException("User Not Found By Id!!"));
        if (user instanceof Admin admin) {
            if (admin.getWarehouse() == null) {
                WareHouse wareHouse = wareHouseMapper.toEntity(wareHouseRequest, new WareHouse());
                admin.setWarehouse(wareHouse);
                wareHouseRepository.save(wareHouse);
                userRepository.save(admin);
                return wareHouseMapper.toResponse(wareHouse);
            } else
                throw new IllegalOperationException("Admin Already Has a Warehouse");
        } else
            throw new IllegalOperationException("User Not AN Admin!!");
    }

    @Override
    public java.util.List<WareHouseResponse> findAllWareHouses() {
        return wareHouseRepository.findAll(
                new com.example.warehouse.repository.specification.SpecificationBuilder<WareHouse>().build())
                .stream().map(wareHouseMapper::toResponse).toList();
    }

    @Override
    public WareHouseResponse findWareHouseById(String warehouseId) {
        WareHouse wareHouse = wareHouseRepository.findById(warehouseId)
                .filter(w -> !w.isDeleted())
                .orElseThrow(() -> new IllegalOperationException("Warehouse Not Found By Id"));
        return wareHouseMapper.toResponse(wareHouse);
    }

    @Override
    @Transactional
    public WareHouseResponse updateWareHouse(String warehouseId, WareHouseRequest wareHouseRequest) {
        WareHouse existingWareHouse = wareHouseRepository.findById(warehouseId)
                .filter(w -> !w.isDeleted())
                .orElseThrow(() -> new IllegalOperationException("Warehouse Not Found By Id"));
        WareHouse updatedWareHouse = wareHouseMapper.toEntity(wareHouseRequest, existingWareHouse);
        wareHouseRepository.save(updatedWareHouse);
        return wareHouseMapper.toResponse(updatedWareHouse);
    }

    @Override
    @Transactional
    public WareHouseResponse deleteWareHouse(String warehouseId) {
        WareHouse wareHouse = wareHouseRepository.findById(warehouseId)
                .orElseThrow(() -> new IllegalOperationException("Warehouse Not Found By Id"));
        WareHouseResponse response = wareHouseMapper.toResponse(wareHouse);
        wareHouse.setDeleted(true);
        wareHouse.setDeletedAt(java.time.Instant.now());
        wareHouseRepository.save(wareHouse);
        return response;
    }

    @Override
    @Transactional
    public WareHouseResponse restoreWareHouse(String warehouseId) {
        WareHouse wareHouse = wareHouseRepository.findById(warehouseId)
                .orElseThrow(() -> new IllegalOperationException("Warehouse Not Found By Id"));
        wareHouse.setDeleted(false);
        wareHouse.setDeletedAt(null);
        wareHouseRepository.save(wareHouse);
        return wareHouseMapper.toResponse(wareHouse);
    }
}
