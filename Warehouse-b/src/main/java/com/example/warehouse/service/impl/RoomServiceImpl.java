package com.example.warehouse.service.impl;

import com.example.warehouse.dto.mapper.RoomMapper;
import com.example.warehouse.dto.request.RoomRequest;
import com.example.warehouse.dto.response.RoomResponse;
import com.example.warehouse.entity.Room;
import com.example.warehouse.entity.WareHouse;
import com.example.warehouse.exceptions.IllegalOperationException;
import com.example.warehouse.exceptions.WareHouseNotFindByIdException;
import com.example.warehouse.repository.RoomRepository;
import com.example.warehouse.repository.WareHouseRepository;
import com.example.warehouse.service.contract.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@SuppressWarnings("null")
public class RoomServiceImpl implements RoomService {

    @Autowired
    private WareHouseRepository wareHouseRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMapper roomMapper;

    @Transactional
    @Override
    public RoomResponse createRoom(RoomRequest request, String warehouseId) {
        WareHouse wareHouse = wareHouseRepository.findById(warehouseId)
                .orElseThrow(() -> new WareHouseNotFindByIdException("WareHouse Not Find!!"));
        Room room = roomMapper.toEntity(request, new Room());
        room.setWarehouse(wareHouse);
        wareHouseRepository.save(wareHouse);
        roomRepository.save(room);
        return roomMapper.toResponse(room);
    }

    @Override
    public java.util.List<RoomResponse> findAllRooms() {
        return roomRepository.findAll().stream().map(roomMapper::toResponse).toList();
    }

    @Override
    public RoomResponse findRoomById(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalOperationException("Room Not Found By Id"));
        return roomMapper.toResponse(room);
    }

    @Override
    @Transactional
    public RoomResponse updateRoom(String roomId, RoomRequest request) {
        Room existingRoom = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalOperationException("Room Not Found By Id"));
        Room updatedRoom = roomMapper.toEntity(request, existingRoom);
        roomRepository.save(updatedRoom);
        return roomMapper.toResponse(updatedRoom);
    }

    @Override
    @Transactional
    public RoomResponse deleteRoom(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalOperationException("Room Not Found By Id"));
        RoomResponse response = roomMapper.toResponse(room);
        roomRepository.delete(room);
        return response;
    }
}
