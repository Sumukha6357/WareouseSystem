package com.example.warehouse.service.implementation;

import com.example.warehouse.entity.Vehicle;
import com.example.warehouse.exception.ResourceNotFoundException;
import com.example.warehouse.repository.VehicleRepository;
import com.example.warehouse.service.contract.VehicleService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@SuppressWarnings("null")
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, SimpMessagingTemplate messagingTemplate) {
        this.vehicleRepository = vehicleRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public Vehicle registerVehicle(Vehicle vehicle) {
        vehicle.setActive(true);
        vehicle.setLastUpdatedAt(Instant.now());
        return vehicleRepository.save(vehicle);
    }

    @Override
    public Vehicle getVehicleById(String vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));
    }

    @Override
    public Vehicle getVehicleByNumber(String vehicleNumber) {
        return vehicleRepository.findByVehicleNumber(vehicleNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with number: " + vehicleNumber));
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    public List<Vehicle> getActiveVehicles() {
        return vehicleRepository.findByActiveTrue();
    }

    @Override
    @Transactional
    public Vehicle updateVehicleLocation(String vehicleId, Double latitude, Double longitude) {
        Vehicle vehicle = getVehicleById(vehicleId);
        vehicle.setLastLatitude(latitude);
        vehicle.setLastLongitude(longitude);
        vehicle.setLastUpdatedAt(Instant.now());
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        messagingTemplate.convertAndSend("/topic/vehicles", savedVehicle);
        return savedVehicle;
    }

    @Override
    @Transactional
    public Vehicle updateVehicleStatus(String vehicleId, boolean active) {
        Vehicle vehicle = getVehicleById(vehicleId);
        vehicle.setActive(active);
        vehicle.setLastUpdatedAt(Instant.now());
        return vehicleRepository.save(vehicle);
    }

    @Override
    public void deleteVehicle(String vehicleId) {
        Vehicle vehicle = getVehicleById(vehicleId);
        vehicleRepository.delete(vehicle);
    }
}
