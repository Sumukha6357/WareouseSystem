import api from '@/lib/api';

export interface Warehouse {
    warehouseId: string;
    description: string;
    location: string;
    latitude?: number;
    longitude?: number;
}

export const WarehouseService = {
    getAllWarehouses: async () => {
        const response = await api.get<Warehouse[]>('/warehouses');
        return response.data;
    },

    getWarehouseById: async (warehouseId: string) => {
        const response = await api.get<Warehouse>(`/warehouses/${warehouseId}`);
        return response.data;
    }
};
