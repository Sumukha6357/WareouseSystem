package com.example.warehouse.controller;

import com.example.warehouse.dto.request.WareHouseRequest;
import com.example.warehouse.dto.response.WareHouseResponse;
import com.example.warehouse.dto.wrapper.ResponseStructure;
import com.example.warehouse.service.contract.WareHouseService;
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
import java.util.List;

@RestController
public class WareHouseController {

    @Autowired
    private WareHouseService wareHouseService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/warehouses/{userId}")
    public ResponseEntity<ResponseStructure<WareHouseResponse>> createWareHouse(
            @RequestBody WareHouseRequest wareHouseRequest, @PathVariable String userId) {

        WareHouseResponse wareHouseResponse = wareHouseService.createWareHouse(wareHouseRequest, userId);
        ResponseStructure<WareHouseResponse> responseStructure = new ResponseStructure<>(HttpStatus.CREATED.value(),
                "WareHouse Created Successfuly", wareHouseResponse);
        return new ResponseEntity<ResponseStructure<WareHouseResponse>>(responseStructure, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/warehouses")
    public ResponseEntity<ResponseStructure<java.util.List<WareHouseResponse>>> findAllWarehouses() {
        List<WareHouseResponse> warehouses = wareHouseService.findAllWareHouses();
        ResponseStructure<List<WareHouseResponse>> responseStructure = new ResponseStructure<>(HttpStatus.OK.value(),
                "All Warehouses Found", warehouses);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/warehouses/{warehouseId}")
    public ResponseEntity<ResponseStructure<WareHouseResponse>> findWarehouseById(@PathVariable String warehouseId) {
        WareHouseResponse warehouse = wareHouseService.findWareHouseById(warehouseId);
        ResponseStructure<WareHouseResponse> responseStructure = new ResponseStructure<>(HttpStatus.OK.value(),
                "Warehouse Found", warehouse);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/warehouses/{warehouseId}")
    public ResponseEntity<ResponseStructure<WareHouseResponse>> updateWarehouse(
            @PathVariable String warehouseId,
            @RequestBody WareHouseRequest wareHouseRequest) {
        WareHouseResponse warehouse = wareHouseService.updateWareHouse(warehouseId, wareHouseRequest);
        ResponseStructure<WareHouseResponse> responseStructure = new ResponseStructure<>(HttpStatus.OK.value(),
                "Warehouse Updated Successfully", warehouse);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/warehouses/{warehouseId}")
    public ResponseEntity<ResponseStructure<WareHouseResponse>> deleteWarehouse(@PathVariable String warehouseId) {
        WareHouseResponse warehouse = wareHouseService.deleteWareHouse(warehouseId);
        ResponseStructure<WareHouseResponse> responseStructure = new ResponseStructure<>(HttpStatus.OK.value(),
                "Warehouse Deleted Successfully", warehouse);
        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
    }

}
