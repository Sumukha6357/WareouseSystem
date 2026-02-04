'use client';

import React, { useState, useEffect } from 'react';
import { ShipmentService, Shipment } from '@/services/ShipmentService';
import { ShipperService, Shipper } from '@/services/ShipperService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Package, Truck, ArrowRight, MapPin, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ShipmentManagementView() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [shippers, setShippers] = useState<Shipper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [shipmentData, shipperData] = await Promise.all([
                ShipmentService.getAllShipments(),
                ShipperService.getActiveShippers()
            ]);
            setShipments(shipmentData);
            setShippers(shipperData);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (shipmentId: string, newStatus: string) => {
        try {
            await ShipmentService.updateStatus(shipmentId, newStatus);
            toast.success(`Shipment updated to ${newStatus}`);
            loadData();
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CREATED': return 'bg-gray-100 text-gray-800';
            case 'PICKED': return 'bg-yellow-100 text-yellow-800';
            case 'PACKED': return 'bg-blue-100 text-blue-800';
            case 'IN_TRANSIT': return 'bg-indigo-100 text-indigo-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredShipments = filterStatus === 'ALL'
        ? shipments
        : shipments.filter(s => s.status === filterStatus);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="h-8 w-8 text-indigo-600" />
                        Shipment Management
                    </h1>
                    <p className="text-gray-500 mt-1">Track and manage outbound shipments</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto pb-1">
                {['ALL', 'CREATED', 'PICKED', 'PACKED', 'IN_TRANSIT', 'DELIVERED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === status
                                ? 'border-b-2 border-indigo-600 text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredShipments.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <Box className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">No shipments found with this status.</p>
                        </div>
                    ) : (
                        filteredShipments.map((shipment) => (
                            <Card key={shipment.shipmentId} className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-3 rounded-full ${getStatusColor(shipment.status)}`}>
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{shipment.shipmentCode}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                                                {shipment.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">Order: #{shipment.orderId.substring(0, 8)}...</p>

                                        {shipment.shipperId ? (
                                            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-600">
                                                <Truck className="w-3.5 h-3.5" />
                                                <span>Shipper: {shippers.find(s => s.shipperId === shipment.shipperId)?.name || 'Unknown'}</span>
                                                {shipment.trackingNumber && (
                                                    <span className="text-gray-400">| Trk: {shipment.trackingNumber}</span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="mt-1 text-sm text-orange-600 italic">No Shipper Assigned</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {shipment.status === 'CREATED' && (
                                        <Button size="sm" onClick={() => handleStatusUpdate(shipment.shipmentId, 'PICKED')}>
                                            Mark Picked
                                        </Button>
                                    )}
                                    {shipment.status === 'PICKED' && (
                                        <Button size="sm" onClick={() => handleStatusUpdate(shipment.shipmentId, 'PACKED')}>
                                            Mark Packed
                                        </Button>
                                    )}
                                    {shipment.status === 'PACKED' && (
                                        <Button size="sm" onClick={() => handleStatusUpdate(shipment.shipmentId, 'DISPATCHED')}>
                                            Dispatch
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function Box({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
    )
}
