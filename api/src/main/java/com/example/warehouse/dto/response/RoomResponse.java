package com.example.warehouse.dto.response;

import java.util.List;

public record RoomResponse(
                String roomId,
                String name,
                List<BlockResponse> blocks) {
}
