package com.example.warehouse.controller;

import com.example.warehouse.dto.request.BlockRequest;
import com.example.warehouse.dto.response.BlockResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.BlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BlockController {

    @Autowired
    private BlockService blockService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/blocks/{roomId}")
    public ResponseEntity<ResponseStructure<BlockResponse>> createBlock(@RequestBody BlockRequest request,
            @PathVariable String roomId) {
        BlockResponse blockResponse = blockService.createBlock(request, roomId);
        ResponseStructure<BlockResponse> responseStructure = new ResponseStructure<>(HttpStatus.CREATED.value(),
                "Block Created Successfully!", blockResponse);
        return new ResponseEntity<ResponseStructure<BlockResponse>>(responseStructure, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/blocks")
    public ResponseEntity<ResponseStructure<java.util.List<BlockResponse>>> findAllBlocks() {
        java.util.List<BlockResponse> blocks = blockService.findAllBlocks();
        ResponseStructure<java.util.List<BlockResponse>> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "All Blocks Found", blocks);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/blocks/{blockId}")
    public ResponseEntity<ResponseStructure<BlockResponse>> findBlockById(@PathVariable String blockId) {
        BlockResponse block = blockService.findBlockById(blockId);
        ResponseStructure<BlockResponse> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Block Found", block);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/blocks/{blockId}")
    public ResponseEntity<ResponseStructure<BlockResponse>> updateBlock(
            @PathVariable String blockId,
            @RequestBody BlockRequest request) {
        BlockResponse block = blockService.updateBlock(blockId, request);
        ResponseStructure<BlockResponse> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Block Updated Successfully", block);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/blocks/{blockId}")
    public ResponseEntity<ResponseStructure<BlockResponse>> deleteBlock(@PathVariable String blockId) {
        BlockResponse block = blockService.deleteBlock(blockId);
        ResponseStructure<BlockResponse> responseStructure = new ResponseStructure<>(
                HttpStatus.OK.value(),
                "Block Deleted Successfully", block);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }
}
