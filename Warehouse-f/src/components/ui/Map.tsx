'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { Vehicle } from '@/services/VehicleService';
import { Warehouse } from '@/services/WarehouseService'; // Assuming we have this, or we mock
import { useEffect, useState } from 'react';

// Fix Leaflet default icon issue in Next.js
const bufferIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const vehicleIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png', // Simple truck icon
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

interface MapProps {
    vehicles: Vehicle[];
    warehouses?: any[]; // Allow partial
}

// Default center (San Francisco roughly, or adjustable)
const DEFAULT_CENTER: [number, number] = [37.7749, -122.4194];

export default function MapComponent({ vehicles, warehouses = [] }: MapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />;

    return (
        <MapContainer center={DEFAULT_CENTER} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Vehicles */}
            {vehicles.map((vehicle) => (
                vehicle.lastLatitude && vehicle.lastLongitude && (
                    <Marker
                        key={vehicle.vehicleId}
                        position={[vehicle.lastLatitude, vehicle.lastLongitude]}
                        icon={vehicleIcon}
                    >
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold">{vehicle.vehicleNumber}</h3>
                                <p className="text-sm">Driver: {vehicle.driverName}</p>
                                <p className="text-xs text-gray-500">
                                    Last Update: {vehicle.lastUpdatedAt ? new Date(vehicle.lastUpdatedAt).toLocaleTimeString() : 'N/A'}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}

            {/* Mock Warehouse Marker if none provided */}
            {warehouses.length === 0 && (
                <Marker position={DEFAULT_CENTER} icon={bufferIcon}>
                    <Popup>
                        <div className="font-bold">Main Warehouse</div>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}
