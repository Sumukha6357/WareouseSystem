'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { VehicleService, Vehicle } from '@/services/VehicleService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RefreshCw, Map as MapIcon, Truck, Wifi } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { toast } from 'react-hot-toast';

// Dynamic import for Leaflet map (client-side only)
const MapComponent = dynamic(() => import('@/components/ui/Map'), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function LiveTrackingView() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [eventLog, setEventLog] = useState<string[]>([]);

    // Initial Load
    useEffect(() => {
        loadData();
    }, []);

    // WebSocket Integration
    const { isConnected } = useWebSocket('/topic/vehicles', (updatedVehicle: Vehicle) => {
        setVehicles(prevVehicles => {
            const exists = prevVehicles.find(v => v.vehicleId === updatedVehicle.vehicleId);
            if (exists) {
                // Check if meaningful change (e.g. status)
                if (exists.active !== updatedVehicle.active) {
                    toast(updatedVehicle.active ? `Vehicle ${updatedVehicle.vehicleNumber} is now Active` : `Vehicle ${updatedVehicle.vehicleNumber} goes Offline`, { icon: '🚚' });
                }
                return prevVehicles.map(v => v.vehicleId === updatedVehicle.vehicleId ? updatedVehicle : v);
            } else {
                toast.success(`New Vehicle Online: ${updatedVehicle.vehicleNumber}`);
                return [...prevVehicles, updatedVehicle];
            }
        });
        setLastUpdated(new Date());

        // Add visual log
        const time = new Date().toLocaleTimeString();
        setEventLog(prev => [`[${time}] Vehicle ${updatedVehicle.vehicleNumber} moved`, ...prev].slice(0, 5));
    });

    const loadData = async () => {
        try {
            // Simulated data if API returns empty for demo purposes
            // In a real app we'd fetch Warehouse data too
            // const warehouseData = await WarehouseService.getAllWarehouses();
            // setWarehouses(warehouseData);

            const realData = await VehicleService.getActiveVehicles();

            // If no vehicles have location, mock some for visualization
            if (realData.length === 0 || !realData.some(v => v.lastLatitude)) {
                // Keep mock data for demo, BUT we want to see live updates if any come in
                console.log("No live vehicles found, using mock data for demo");
                const mockVehicles: Vehicle[] = [
                    {
                        vehicleId: 'v1',
                        vehicleNumber: 'TRUCK-001',
                        licensePlate: 'ABC-123',
                        driverName: 'John Doe',
                        driverPhone: '555-0123',
                        capacity: 1000,
                        active: true,
                        lastLatitude: 37.7749,
                        lastLongitude: -122.4194,
                        lastUpdatedAt: Date.now()
                    },
                    {
                        vehicleId: 'v2',
                        vehicleNumber: 'TRUCK-002',
                        licensePlate: 'XYZ-789',
                        driverName: 'Jane Smith',
                        driverPhone: '555-0124',
                        capacity: 1500,
                        active: true,
                        lastLatitude: 37.7849,
                        lastLongitude: -122.4094,
                        lastUpdatedAt: Date.now()
                    }
                ];
                setVehicles(mockVehicles);
            } else {
                setVehicles(realData);
            }

            setLastUpdated(new Date());
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to load tracking data:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MapIcon className="h-8 w-8 text-indigo-600" />
                        Live Tracking
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500">Real-time fleet monitoring</p>
                        {isConnected ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <Wifi className="w-3 h-3 mr-1" /> Live
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                Connecting...
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => loadData()}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex gap-6 h-full">
                {/* Sidebar List */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-4">
                    <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                        {vehicles.map(vehicle => (
                            <Card key={vehicle.vehicleId} className="p-4 hover:shadow-md cursor-pointer transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{vehicle.vehicleNumber}</h3>
                                        <p className="text-xs text-gray-500">{vehicle.driverName}</p>
                                    </div>
                                </div>
                                <div className="mt-3 text-xs text-gray-400 flex justify-between">
                                    <span>Status: {vehicle.active ? 'Active' : 'Inactive'}</span>
                                    <span>{vehicle.lastUpdatedAt ? 'Online' : 'Offline'}</span>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Live Event Log */}
                    {eventLog.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-xs font-mono">
                            <h4 className="font-bold text-gray-500 mb-2 uppercase">Live Signal Log</h4>
                            <ul className="space-y-1">
                                {eventLog.map((log, i) => (
                                    <li key={i} className="text-gray-700">{log}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Map Area */}
                <Card className="flex-1 overflow-hidden relative border-0 shadow-lg">
                    <MapComponent vehicles={vehicles} warehouses={warehouses} />
                </Card>
            </div>
        </div>
    );
}
