package com.example.warehouse.service.contract;

import com.example.warehouse.dto.request.WareHouseRequest;
import com.example.warehouse.dto.response.WareHouseResponse;

public interface WareHouseService {
    WareHouseResponse createWareHouse(WareHouseRequest wareHouseRequest, String userId);

    java.util.List<WareHouseResponse> findAllWareHouses();

    WareHouseResponse findWareHouseById(String warehouseId);

    WareHouseResponse updateWareHouse(String warehouseId, WareHouseRequest wareHouseRequest);

    WareHouseResponse deleteWareHouse(String warehouseId);

    WareHouseResponse restoreWareHouse(String warehouseId);
}
