package com.example.warehouse.service.contract;

import com.example.warehouse.entity.Shipper;
import com.example.warehouse.entity.ShipperType;
import java.util.List;

public interface ShipperService {
    Shipper createShipper(Shipper shipper);

    Shipper getShipperById(String shipperId);

    List<Shipper> getAllShippers();

    List<Shipper> getShippersByType(ShipperType type);

    List<Shipper> getActiveShippers();

    Shipper updateShipper(String shipperId, Shipper shipper);

    void deleteShipper(String shipperId);

    Shipper restoreShipper(String shipperId);
}
