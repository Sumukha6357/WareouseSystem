package com.example.warehouse.service.impl;

import com.example.warehouse.entity.Shipper;
import com.example.warehouse.entity.ShipperType;
import com.example.warehouse.exception.ResourceNotFoundException;
import com.example.warehouse.repository.ShipperRepository;
import com.example.warehouse.service.contract.ShipperService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@SuppressWarnings("null")
public class ShipperServiceImpl implements ShipperService {

    private final ShipperRepository shipperRepository;

    public ShipperServiceImpl(ShipperRepository shipperRepository) {
        this.shipperRepository = shipperRepository;
    }

    @Override
    public Shipper createShipper(Shipper shipper) {
        return shipperRepository.save(shipper);
    }

    @Override
    public Shipper getShipperById(String shipperId) {
        return shipperRepository.findById(shipperId)
                .filter(s -> !s.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Shipper not found with id: " + shipperId));
    }

    @Override
    public List<Shipper> getAllShippers() {
        return shipperRepository.findAll(
                new com.example.warehouse.repository.specification.SpecificationBuilder<Shipper>().build());
    }

    @Override
    public List<Shipper> getShippersByType(ShipperType type) {
        return shipperRepository.findByType(type);
    }

    @Override
    public List<Shipper> getActiveShippers() {
        return shipperRepository.findByActiveTrue();
    }

    @Override
    @Transactional
    public Shipper updateShipper(String shipperId, Shipper shipperDetails) {
        Shipper shipper = getShipperById(shipperId);

        shipper.setName(shipperDetails.getName());
        shipper.setType(shipperDetails.getType());
        shipper.setServiceLevel(shipperDetails.getServiceLevel());
        shipper.setTrackingUrlTemplate(shipperDetails.getTrackingUrlTemplate());
        shipper.setContactDetails(shipperDetails.getContactDetails());
        shipper.setActive(shipperDetails.getActive());

        return shipperRepository.save(shipper);
    }

    @Override
    public void deleteShipper(String shipperId) {
        Shipper shipper = getShipperById(shipperId);
        shipper.setDeleted(true);
        shipper.setDeletedAt(java.time.Instant.now());
        shipperRepository.save(shipper);
    }

    @Override
    public Shipper restoreShipper(String shipperId) {
        Shipper shipper = getShipperById(shipperId);
        shipper.setDeleted(false);
        shipper.setDeletedAt(null);
        return shipperRepository.save(shipper);
    }
}
