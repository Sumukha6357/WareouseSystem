'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Truck, MapPin, Power } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function DriverView() {
    const [vehicleId, setVehicleId] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [location, setLocation] = useState({ lat: 37.7749, lng: -122.4194 });

    const toggleStatus = async () => {
        if (!vehicleId) {
            toast.error('Enter Vehicle ID first');
            return;
        }
        try {
            await api.put(`/vehicles/${vehicleId}/status?active=${!isActive}`);
            setIsActive(!isActive);
            toast.success(isActive ? 'Shift Ended' : 'Shift Started');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const updateLocation = async () => {
        if (!vehicleId) {
            toast.error('Enter Vehicle ID first');
            return;
        }
        // Simulate movement
        const newLat = location.lat + (Math.random() - 0.5) * 0.01;
        const newLng = location.lng + (Math.random() - 0.5) * 0.01;

        try {
            await api.put(`/vehicles/${vehicleId}/location`, null, {
                params: { latitude: newLat, longitude: newLng }
            });
            setLocation({ lat: newLat, lng: newLng });
            toast.success('Location Updated');
        } catch (error) {
            toast.error('Failed to update location');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
            <Card className="w-full max-w-sm p-6 space-y-6">
                <div className="text-center">
                    <div className="mx-auto bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <Truck className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Driver Portal</h1>
                    <p className="text-gray-500">Vehicle GPS Simulator</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Vehicle ID</label>
                        <Input
                            placeholder="e.g. v1"
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant={isActive ? 'destructive' : 'primary'}
                            className="w-full h-12"
                            onClick={toggleStatus}
                        >
                            <Power className="w-4 h-4 mr-2" />
                            {isActive ? 'End Shift' : 'Start Shift'}
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full h-12"
                            onClick={updateLocation}
                            disabled={!isActive}
                        >
                            <MapPin className="w-4 h-4 mr-2" />
                            Ping GPS
                        </Button>
                    </div>

                    {isActive && (
                        <div className="bg-gray-100 p-3 rounded text-xs text-mono text-gray-600">
                            <p>Lat: {location.lat.toFixed(6)}</p>
                            <p>Lng: {location.lng.toFixed(6)}</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
