package com.example.warehouse.controller;

import com.example.warehouse.dto.request.RoomRequest;
import com.example.warehouse.dto.response.RoomResponse;
import com.example.warehouse.dto.wrapper.PageResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.RoomService;
import com.example.warehouse.util.PageUtils;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/rooms/{warehouseId}")
    public ResponseEntity<ResponseStructure<RoomResponse>> createRoom(@Valid @RequestBody RoomRequest request,
            @PathVariable String warehouseId) {
        RoomResponse roomResponse = roomService.createRoom(request, warehouseId);
        ResponseStructure<RoomResponse> responseStructure = new ResponseStructure<>(HttpStatus.CREATED.value(),
                "Room Successfully Created", roomResponse);
        return new ResponseEntity<ResponseStructure<RoomResponse>>(responseStructure, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/rooms")
    public ResponseEntity<ResponseStructure<java.util.List<RoomResponse>>> findAllRooms() {
        java.util.List<RoomResponse> rooms = roomService.findAllRooms();
        ResponseStructure<java.util.List<RoomResponse>> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "All Rooms Found", rooms);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = "/rooms", params = { "page", "size" })
    public ResponseEntity<ResponseStructure<PageResponse<RoomResponse>>> findAllRoomsPaged(Pageable pageable) {
        java.util.List<RoomResponse> rooms = roomService.findAllRooms();
        PageResponse<RoomResponse> pageResponse = PageUtils.toPageResponse(PageUtils.paginate(rooms, pageable));
        ResponseStructure<PageResponse<RoomResponse>> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "All Rooms Found", pageResponse);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ResponseStructure<RoomResponse>> findRoomById(@PathVariable String roomId) {
        RoomResponse room = roomService.findRoomById(roomId);
        ResponseStructure<RoomResponse> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Room Found", room);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<ResponseStructure<RoomResponse>> updateRoom(
            @PathVariable String roomId,
            @Valid @RequestBody RoomRequest request) {
        RoomResponse room = roomService.updateRoom(roomId, request);
        ResponseStructure<RoomResponse> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Room Updated Successfully", room);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<ResponseStructure<RoomResponse>> deleteRoom(@PathVariable String roomId) {
        RoomResponse room = roomService.deleteRoom(roomId);
        ResponseStructure<RoomResponse> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Room Deleted Successfully", room);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/rooms/{roomId}/restore")
    public ResponseEntity<ResponseStructure<RoomResponse>> restoreRoom(@PathVariable String roomId) {
        RoomResponse room = roomService.restoreRoom(roomId);
        ResponseStructure<RoomResponse> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Room Restored Successfully", room);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }
}
