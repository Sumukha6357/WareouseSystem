'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import type { VehicleResponse, PickHeatmapResponse } from '@/types/api';

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
    vehicles: VehicleResponse[];
    warehouses?: unknown[]; // Allow partial
    pickHeatmap?: PickHeatmapResponse[];
}

// Default center (San Francisco roughly, or adjustable)
const DEFAULT_CENTER: [number, number] = [37.7749, -122.4194];

// Helper to generate deterministic offsets for demo blocks based on ID
const getBlockPosition = (blockId: string): [number, number] => {
    // Simple hash to float
    const hash = blockId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const latOffset = (hash % 20 - 10) * 0.001;
    const lngOffset = (hash % 20 - 10) * 0.001;
    return [DEFAULT_CENTER[0] + latOffset, DEFAULT_CENTER[1] + lngOffset];
};

const getCongestionColor = (level: string) => {
    switch (level) {
        case 'CRITICAL': return '#ef4444'; // Red-500
        case 'HIGH': return '#f97316'; // Orange-500
        case 'MEDIUM': return '#eab308'; // Yellow-500
        default: return '#22c55e'; // Green-500
    }
};

export default function MapComponent({ vehicles, warehouses = [], pickHeatmap = [] }: MapProps) {
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

            {/* Pick Heatmap (Active Blocks) */}
            {pickHeatmap.map((heat) => (
                <Circle
                    key={heat.blockId}
                    center={getBlockPosition(heat.blockId)}
                    pathOptions={{
                        color: getCongestionColor(heat.congestionLevel),
                        fillColor: getCongestionColor(heat.congestionLevel),
                        fillOpacity: 0.4
                    }}
                    radius={50 + (heat.activePicksCount * 10)} // Size grows with activity
                >
                    <Popup>
                        <div className="p-1 text-center">
                            <h3 className="font-bold text-gray-800">{heat.blockName}</h3>
                            <p className="text-sm font-semibold mt-1">
                                {heat.activePicksCount} Active Picks
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full text-white mt-1 inline-block`} style={{ backgroundColor: getCongestionColor(heat.congestionLevel) }}>
                                {heat.congestionLevel} CONGESTION
                            </span>
                        </div>
                    </Popup>
                </Circle>
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
