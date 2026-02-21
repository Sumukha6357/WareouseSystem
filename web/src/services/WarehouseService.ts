import httpClient from '@/lib/httpClient';
import type { WareHouseResponse } from '@/types/api';

export const WarehouseService = {
    getAllWarehouses: (): Promise<WareHouseResponse[]> =>
        httpClient.get('/warehouses'),

    getWarehouseById: (warehouseId: string): Promise<WareHouseResponse> =>
        httpClient.get(`/warehouses/${warehouseId}`),
};
