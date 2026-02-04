package com.example.warehouse.service.contract;

import com.example.warehouse.entity.Vehicle;
import java.util.List;

public interface VehicleService {
    Vehicle registerVehicle(Vehicle vehicle);

    Vehicle getVehicleById(String vehicleId);

    Vehicle getVehicleByNumber(String vehicleNumber);

    List<Vehicle> getAllVehicles();

    List<Vehicle> getActiveVehicles();

    Vehicle updateVehicleLocation(String vehicleId, Double latitude, Double longitude);

    Vehicle updateVehicleStatus(String vehicleId, boolean active);

    void deleteVehicle(String vehicleId);
}
