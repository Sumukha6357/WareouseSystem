import httpClient from '@/lib/httpClient';
import type { VehicleResponse } from '@/types/api';

export const VehicleService = {
    getAllVehicles: (): Promise<VehicleResponse[]> =>
        httpClient.get('/vehicles'),

    getActiveVehicles: async (): Promise<VehicleResponse[]> => {
        const vehicles = await httpClient.get<VehicleResponse[]>('/vehicles');
        return vehicles.filter((v) => v.active);
    },

    getVehicleById: (vehicleId: string): Promise<VehicleResponse> =>
        httpClient.get(`/vehicles/${vehicleId}`),
};
