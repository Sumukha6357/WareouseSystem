import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShipmentService } from '../ShipmentService';
import httpClient from '@/lib/httpClient';

// Mock httpClient
vi.mock('@/lib/httpClient', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        putWithParams: vi.fn(),
    },
}));

describe('ShipmentService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getAllShipments calls the correct endpoint', async () => {
        const mockShipments = [{ shipmentId: '1', shipmentCode: 'SHIP-001' }];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (httpClient.get as any).mockResolvedValue(mockShipments);

        const result = await ShipmentService.getAllShipments();

        expect(httpClient.get).toHaveBeenCalledWith('/shipments/all');
        expect(result).toEqual(mockShipments);
    });

    it('createShipment calls the correct endpoint with data', async () => {
        const request = { orderId: 'ORD-123', shipperId: 'SHIP-456' };
        const mockResponse = { shipmentId: 'S1', ...request };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (httpClient.post as any).mockResolvedValue(mockResponse);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await ShipmentService.createShipment(request as any);

        expect(httpClient.post).toHaveBeenCalledWith('/shipments', request);
        expect(result).toEqual(mockResponse);
    });

    it('updateStatus calls putWithParams with correct data', async () => {
        const shipmentId = 'S1';
        const status = 'DELIVERED';
        const params = { status, location: 'Warehouse A', notes: 'All good' };

        await ShipmentService.updateStatus(shipmentId, status, params.location, params.notes);

        expect(httpClient.putWithParams).toHaveBeenCalledWith(
            `/shipments/${shipmentId}/status`,
            params
        );
    });
});
