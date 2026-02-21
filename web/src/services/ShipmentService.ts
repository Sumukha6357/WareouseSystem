import httpClient from '@/lib/httpClient';
import type { ShipmentResponse, CreateShipmentRequest } from '@/types/api';

export const ShipmentService = {
    getAllShipments: (): Promise<ShipmentResponse[]> =>
        httpClient.get('/shipments/all'),

    getShipmentsByStatus: (status: string): Promise<ShipmentResponse[]> =>
        httpClient.get(`/shipments/status/${status}`),

    createShipment: (request: CreateShipmentRequest): Promise<ShipmentResponse> =>
        httpClient.post('/shipments', request),

    updateStatus: (
        shipmentId: string,
        status: string,
        location?: string,
        notes?: string,
    ): Promise<ShipmentResponse> =>
        httpClient.putWithParams(`/shipments/${shipmentId}/status`, {
            status,
            location,
            notes,
        }),

    assignShipper: (
        shipmentId: string,
        shipperId: string,
    ): Promise<ShipmentResponse> =>
        httpClient.putWithParams(`/shipments/${shipmentId}/assign-shipper`, {
            shipperId,
        }),
};
