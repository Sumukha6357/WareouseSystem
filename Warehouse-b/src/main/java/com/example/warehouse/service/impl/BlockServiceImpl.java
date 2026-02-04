package com.example.warehouse.service.impl;

import com.example.warehouse.dto.mapper.BlockMapper;
import com.example.warehouse.dto.request.BlockRequest;
import com.example.warehouse.dto.response.BlockResponse;
import com.example.warehouse.entity.Block;
import com.example.warehouse.entity.Recked;
import com.example.warehouse.entity.Room;
import com.example.warehouse.entity.UnRecked;
import com.example.warehouse.exceptions.IllegalOperationException;
import com.example.warehouse.exceptions.RoomNotFoundByIdException;
import com.example.warehouse.exceptions.UnSupportedBlockTypeException;
import com.example.warehouse.repository.BlockRepository;
import com.example.warehouse.repository.RoomRepository;
import com.example.warehouse.service.contract.BlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@SuppressWarnings("null")
public class BlockServiceImpl implements BlockService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BlockRepository blockRepository;

    @Autowired
    private BlockMapper blockMapper;

    @Override
    public BlockResponse createBlock(BlockRequest request, String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundByIdException("Room is Not Exist!!"));
        Block block = switch (request.type()) {
            case RECKED -> blockMapper.toEntity(request, new Recked());
            case UNRECKED -> blockMapper.toEntity(request, new UnRecked());
            default -> throw new UnSupportedBlockTypeException(request.type() + " is Not Available!!");
        };
        block.setRoom(room);
        roomRepository.save(room);
        blockRepository.save(block);
        return blockMapper.toResponse(block);
    }

    @Override
    public java.util.List<BlockResponse> findAllBlocks() {
        return blockRepository.findAll().stream().map(blockMapper::toResponse).toList();
    }

    @Override
    public BlockResponse findBlockById(String blockId) {
        Block block = blockRepository.findById(blockId)
                .orElseThrow(() -> new IllegalOperationException("Block Not Found By Id"));
        return blockMapper.toResponse(block);
    }

    @Override
    @Transactional
    public BlockResponse updateBlock(String blockId, BlockRequest request) {
        Block existingBlock = blockRepository.findById(blockId)
                .orElseThrow(() -> new IllegalOperationException("Block Not Found By Id"));
        Block updatedBlock = blockMapper.toEntity(request, existingBlock);
        blockRepository.save(updatedBlock);
        return blockMapper.toResponse(updatedBlock);
    }

    @Override
    @Transactional
    public BlockResponse deleteBlock(String blockId) {
        Block block = blockRepository.findById(blockId)
                .orElseThrow(() -> new IllegalOperationException("Block Not Found By Id"));
        BlockResponse response = blockMapper.toResponse(block);
        blockRepository.delete(block);
        return response;
    }
}
