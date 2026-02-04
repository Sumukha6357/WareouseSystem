import api from '@/lib/api';

export interface SystemHealth {
    apiLatencyMs: number;
    webSocketSessions: number;
    lastInventorySyncTime: number;
    stuckOrdersCount: number;
    systemStatus: 'OPTIMAL' | 'STRESSED' | 'CRITICAL';
}

export const SystemHealthService = {
    getStats: async (): Promise<SystemHealth> => {
        const response = await api.get('/health/stats');
        return response.data;
    }
};
