import api from '@/lib/api';

export interface Shipper {
    shipperId: string;
    name: string;
    type: 'INTERNAL' | 'THIRD_PARTY';
    serviceLevel: 'SAME_DAY' | 'NEXT_DAY' | 'STANDARD';
    trackingUrlTemplate?: string;
    contactDetails?: string;
    active: boolean;
}

export const ShipperService = {
    getAllShippers: async () => {
        const response = await api.get<any>('/shippers');
        return response.data.data;
    },

    getActiveShippers: async () => {
        const response = await api.get<any>('/shippers/active');
        return response.data.data;
    },

    createShipper: async (shipper: Omit<Shipper, 'shipperId' | 'active'>) => {
        const response = await api.post<any>('/shippers', shipper);
        return response.data.data;
    },

    updateShipper: async (shipperId: string, shipper: Partial<Shipper>) => {
        const response = await api.put<any>(`/shippers/${shipperId}`, shipper);
        return response.data.data;
    },

    deleteShipper: async (shipperId: string) => {
        await api.delete(`/shippers/${shipperId}`);
    }
};
