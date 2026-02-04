import api from '@/lib/api';

export interface Shipment {
    shipmentId: string;
    shipmentCode: string;
    orderId: string;
    shipperId?: string;
    shipperName?: string;
    warehouseId: string;
    trackingNumber?: string;
    status: 'CREATED' | 'PICKED' | 'PACKED' | 'WAITING_FOR_DRIVER' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'RETURNED';
    createdAt: number;
    dispatchedAt?: number;
    deliveredAt?: number;
}

export interface CreateShipmentRequest {
    orderId: string;
    shipperId?: string;
    warehouseId: string;
    trackingNumber?: string;
    items?: {
        productId: string;
        blockId: string;
        quantity: number;
    }[];
}

export const ShipmentService = {
    getAllShipments: async () => {
        // Assuming there is an endpoint for all or we filter
        const response = await api.get<any>('/shipments'); // Changed from /active to match likely controller
        return response.data.data;
    },

    getShipmentsByStatus: async (status: string) => {
        const response = await api.get<any>(`/shipments/status/${status}`);
        return response.data.data;
    },

    createShipment: async (request: CreateShipmentRequest) => {
        const response = await api.post<any>('/shipments', request);
        return response.data.data;
    },

    updateStatus: async (shipmentId: string, status: string, location?: string, notes?: string) => {
        const response = await api.put<any>(`/shipments/${shipmentId}/status`, null, {
            params: { status, location, notes }
        });
        return response.data.data;
    },

    assignShipper: async (shipmentId: string, shipperId: string) => {
        const response = await api.put<any>(`/shipments/${shipmentId}/assign-shipper`, null, {
            params: { shipperId }
        });
        return response.data.data;
    }
};
