package com.example.warehouse.dto.mapper;

import com.example.warehouse.dto.request.BlockRequest;
import com.example.warehouse.dto.response.BlockResponse;
import com.example.warehouse.entity.Block;
import org.springframework.stereotype.Component;

@Component
public class BlockMapper {

    public Block toEntity(BlockRequest source, Block target) {
        if (source == null) {
            return target;
        }
        if (target == null) {
            target = new Block();
        }
        target.setHeight(source.height());
        target.setLength(source.length());
        target.setBreath(source.breath());
        target.setType(source.type());
        return target;
    }

    public BlockResponse toResponse(Block block) {
        if (block == null) {
            return null;
        }

        // Create room info if room exists
        BlockResponse.RoomInfo roomInfo = null;
        if (block.getRoom() != null) {
            roomInfo = new BlockResponse.RoomInfo(
                    block.getRoom().getRoomId(),
                    block.getRoom().getName());
        }

        return new BlockResponse(
                block.getBlockId(),
                block.getHeight(),
                block.getLength(),
                block.getBreath(),
                block.getType(),
                roomInfo);
    }
}
