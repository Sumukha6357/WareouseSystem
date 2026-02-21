'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Truck, MapPin, Power } from 'lucide-react';
import { notify } from '@/lib/notify';
import httpClient from '@/lib/httpClient';

export default function DriverView() {
    const [vehicleId, setVehicleId] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [location, setLocation] = useState({ lat: 37.7749, lng: -122.4194 });

    const toggleStatus = async () => {
        if (!vehicleId) {
            notify.error('Enter Vehicle ID first');
            return;
        }
        try {
            await httpClient.putWithParams(`/vehicles/${vehicleId}/status`, { active: !isActive });
            setIsActive(!isActive);
            notify.success(isActive ? 'Shift Ended' : 'Shift Started');
        } catch {
            notify.error('Failed to update status');
        }
    };

    const updateLocation = async () => {
        if (!vehicleId) {
            notify.error('Enter Vehicle ID first');
            return;
        }
        // Simulate movement
        const newLat = location.lat + (Math.random() - 0.5) * 0.01;
        const newLng = location.lng + (Math.random() - 0.5) * 0.01;

        try {
            await httpClient.putWithParams(`/vehicles/${vehicleId}/location`, { latitude: newLat, longitude: newLng });
            setLocation({ lat: newLat, lng: newLng });
            notify.success('Location Updated');
        } catch {
            notify.error('Failed to update location');
        }
    };

    return (
        <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700">
            <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl shadow-primary/20 border-2 border-card-border/50">
                <div className="bg-primary/10 p-10 flex flex-col items-center border-b border-card-border/50">
                    <div className="bg-background w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-black/5 border-2 border-primary/20 group hover:rotate-6 transition-transform">
                        <Truck className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-sharp italic uppercase tracking-tighter">Protocol Portal</h1>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mt-2">Vehicle GPS Simulation Node</p>
                </div>

                <div className="p-10 space-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-2 italic">Entity Designation</label>
                        <Input
                            placeholder="e.g. TRUCK_ALPHA_01"
                            className="h-14 px-6 rounded-2xl font-black italic uppercase tracking-tighter text-lg"
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button
                            variant={isActive ? 'outline' : 'primary'}
                            className={`h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg ${isActive ? 'border-red-500/30 text-red-500 hover:bg-red-500/5' : 'shadow-primary/30'}`}
                            onClick={toggleStatus}
                        >
                            <Power className="w-4 h-4 mr-2" />
                            {isActive ? 'Terminate Session' : 'Initiate Shift'}
                        </Button>

                        <Button
                            variant="outline"
                            className="h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] border-card-border/50"
                            onClick={updateLocation}
                            disabled={!isActive}
                        >
                            <MapPin className="w-4 h-4 mr-2" />
                            Transmit GPS
                        </Button>
                    </div>

                    {isActive && (
                        <div className="bg-background border-2 border-dashed border-primary/20 p-6 rounded-2xl text-[10px] font-black italic text-primary/70 flex flex-col gap-2 tabular-nums shadow-inner">
                            <p className="flex justify-between"><span>Vector Latitude:</span> <span>{location.lat.toFixed(6)}</span></p>
                            <p className="flex justify-between"><span>Vector Longitude:</span> <span>{location.lng.toFixed(6)}</span></p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
