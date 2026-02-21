import httpClient from '@/lib/httpClient';
import type { SystemHealthResponse } from '@/types/api';

export const SystemHealthService = {
    getStats: (): Promise<SystemHealthResponse> =>
        httpClient.get('/health/stats'),
};
