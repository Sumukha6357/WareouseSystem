import httpClient from '@/lib/httpClient';
import type { ShipperResponse, ShipperRequest } from '@/types/api';

export const ShipperService = {
    getAllShippers: (): Promise<ShipperResponse[]> =>
        httpClient.get('/shippers'),

    getActiveShippers: (): Promise<ShipperResponse[]> =>
        httpClient.get('/shippers/active'),

    createShipper: (shipper: ShipperRequest): Promise<ShipperResponse> =>
        httpClient.post('/shippers', shipper),

    updateShipper: (
        shipperId: string,
        shipper: Partial<ShipperRequest>,
    ): Promise<ShipperResponse> =>
        httpClient.put(`/shippers/${shipperId}`, shipper),

    deleteShipper: (shipperId: string): Promise<void> =>
        httpClient.delete(`/shippers/${shipperId}`),
};
