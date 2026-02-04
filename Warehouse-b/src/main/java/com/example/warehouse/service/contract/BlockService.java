package com.example.warehouse.service.contract;

import com.example.warehouse.dto.request.BlockRequest;
import com.example.warehouse.dto.response.BlockResponse;

public interface BlockService {
    BlockResponse createBlock(BlockRequest request, String roomId);

    java.util.List<BlockResponse> findAllBlocks();

    BlockResponse findBlockById(String blockId);

    BlockResponse updateBlock(String blockId, BlockRequest request);

    BlockResponse deleteBlock(String blockId);
}
