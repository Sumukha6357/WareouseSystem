'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RefreshCw, Map as MapIcon, Truck, Wifi } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { notify } from '@/lib/notify';
import { Badge } from '@/components/ui/Badge';
import type { VehicleResponse, PickHeatmapResponse } from '@/types/api';

// Dynamic import for Leaflet map (client-side only)
const MapComponent = dynamic(() => import('@/components/ui/Map'), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function LiveTrackingView() {
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [pickHeatmap, setPickHeatmap] = useState<PickHeatmapResponse[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [eventLog, setEventLog] = useState<string[]>([]);

    // Initial Load
    useEffect(() => {
        loadData();
    }, []);

    // WebSocket Integration
    const { isConnected } = useWebSocket('/topic/vehicles', (updatedVehicle: VehicleResponse) => {
        setVehicles(prevVehicles => {
            const exists = prevVehicles.find(v => v.vehicleId === updatedVehicle.vehicleId);
            if (exists) {
                // Check if meaningful change (e.g. status)
                if (exists.active !== updatedVehicle.active) {
                    notify.info(updatedVehicle.active ? `Vehicle ${updatedVehicle.vehicleNumber} is now Active` : `Vehicle ${updatedVehicle.vehicleNumber} goes Offline`, { icon: '🚚' });
                }
                return prevVehicles.map(v => v.vehicleId === updatedVehicle.vehicleId ? updatedVehicle : v);
            } else {
                notify.success(`New Vehicle Online: ${updatedVehicle.vehicleNumber}`);
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
            // Load Analytics for Heatmap
            import('../services/AnalyticsService').then(async ({ AnalyticsService }) => {
                try {
                    const dashboardData = await AnalyticsService.getDashboardSummary();
                    if (dashboardData.pickHeatmap) {
                        setPickHeatmap(dashboardData.pickHeatmap);
                    }
                } catch (e) {
                    console.error("Failed to load heatmap", e);
                }
            });

            const realData = await VehicleService.getActiveVehicles();

            // If no vehicles have location, mock some for visualization
            if (realData.length === 0 || !realData.some(v => v.lastLatitude)) {
                // Keep mock data for demo, BUT we want to see live updates if any come in
                console.log("No live vehicles found, using mock data for demo");
                const mockVehicles: VehicleResponse[] = [
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
        } catch (error) {
            console.error('Failed to load tracking data:', error);
        }
    };

    return (
        <div className="space-y-10 h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4 italic uppercase">
                        <MapIcon className="h-10 w-10 text-primary" />
                        Global Fleet Radar
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm font-medium text-muted">Active orchestration of autonomous and manual vehicle clusters.</p>
                        {isConnected ? (
                            <Badge variant="primary" className="h-6 px-3 bg-emerald-500/10 text-emerald-500 border-none animate-pulse italic">
                                <Wifi className="w-3 h-3 mr-1.5" /> Synchronized
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="h-6 px-3 italic bg-rose-500/5 text-rose-500 border-rose-500/20">
                                Segmented
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest leading-none mb-1">Last Transmission</p>
                        <p className="text-sm font-black text-primary tabular-nums italic">{lastUpdated.toLocaleTimeString()}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadData()}
                        className="h-12 px-6 rounded-xl border-card-border/50 font-black uppercase tracking-widest text-[10px] hover:border-primary/30"
                    >
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Recalibrate
                    </Button>
                </div>
            </header>

            <div className="flex gap-6 h-full">
                {/* Sidebar List */}
                <div className="w-96 flex-shrink-0 flex flex-col gap-6">
                    <div className="space-y-4 overflow-y-auto pr-2 flex-1 no-scrollbar">
                        {vehicles.map(vehicle => (
                            <Card key={vehicle.vehicleId} className="p-6 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-x-1 cursor-pointer transition-all duration-300 border-2 border-card-border/30 group">
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl ${vehicle.active ? 'bg-primary/10 text-primary' : 'bg-muted/10 text-muted'} transition-colors group-hover:scale-110`}>
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-black text-sharp italic uppercase tracking-tighter truncate group-hover:text-primary transition-colors">{vehicle.vehicleNumber}</h3>
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-1">{vehicle.driverName}</p>
                                    </div>
                                    {vehicle.active && (
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                                    )}
                                </div>
                                <div className="mt-6 pt-4 border-t border-card-border/30 flex justify-between items-center">
                                    <Badge variant={vehicle.active ? 'primary' : 'outline'} className="h-6 px-3 text-[8px] italic uppercase">
                                        {vehicle.active ? 'Operational' : 'Idle'}
                                    </Badge>
                                    <span className="text-[9px] font-black text-muted uppercase tracking-widest">{vehicle.lastUpdatedAt ? 'Link: Online' : 'Link: Lost'}</span>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Live Event Log */}
                    {eventLog.length > 0 && (
                        <div className="bg-card p-6 rounded-3xl border-2 border-card-border shadow-inner text-[10px] font-black italic">
                            <h4 className="text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Wifi className="h-3 w-3" />
                                Operational Signal Stream
                            </h4>
                            <ul className="space-y-3">
                                {eventLog.map((log, i) => (
                                    <li key={i} className="text-muted/70 flex gap-3 group">
                                        <span className="text-primary/40 tabular-nums">{log.split(']')[0]}]</span>
                                        <span className="text-sharp group-hover:text-primary transition-colors">{log.split(']')[1]}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Map Area */}
                <Card className="flex-1 overflow-hidden relative border-0 shadow-lg">
                    <MapComponent vehicles={vehicles} warehouses={[]} pickHeatmap={pickHeatmap} />
                </Card>
            </div>
        </div>
    );
}
