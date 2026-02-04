package com.example.warehouse.dto.response;

import java.util.List;

public record WareHouseResponse(
        String warehouseId,
        String name,
        String city,
        String address,
        String landmark,
        List<RoomResponse> rooms) {
}
