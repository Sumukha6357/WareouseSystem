import api from '@/lib/api';

export interface Vehicle {
    vehicleId: string;
    vehicleNumber: string;
    licensePlate: string;
    driverName: string;
    driverPhone: string;
    capacity: number;
    active: boolean;
    lastLatitude?: number;
    lastLongitude?: number;
    lastUpdatedAt?: number;
}

export const VehicleService = {
    getAllVehicles: async () => {
        const response = await api.get<Vehicle[]>('/vehicles');
        return response.data;
    },

    getActiveVehicles: async () => {
        const response = await api.get<Vehicle[]>('/vehicles'); // backend handles filter or we filter here
        return response.data.filter(v => v.active);
    },

    getVehicleById: async (vehicleId: string) => {
        const response = await api.get<Vehicle>(`/vehicles/${vehicleId}`);
        return response.data;
    }
};
