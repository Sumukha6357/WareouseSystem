'use client';

import React, { useState, useEffect } from 'react';
import { ShipmentService, Shipment } from '@/services/ShipmentService';
import { ShipperService, Shipper } from '@/services/ShipperService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Package, Truck, ArrowRight, MapPin, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ShipmentManagementView() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [shippers, setShippers] = useState<Shipper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [shipmentData, shipperData] = await Promise.all([
                ShipmentService.getAllShipments(),
                ShipperService.getActiveShippers()
            ]);
            setShipments(shipmentData || []);
            setShippers(shipperData || []);
        } catch (error: any) {
            console.error('Failed to load data:', error);
            setError(error?.message || 'Failed to load shipment data. Please try again.');
            // Don't show toast for initial load errors, show in UI instead
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        loadData();
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
            case 'CREATED': return 'bg-primary/10 text-primary border-primary/20';
            case 'PICKED': return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
            case 'PACKED': return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20';
            case 'IN_TRANSIT': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
            case 'DELIVERED': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
            default: return 'bg-muted/10 text-muted border-card-border/50';
        }
    };

    const filteredShipments = filterStatus === 'ALL'
        ? shipments
        : shipments.filter(s => s.status === filterStatus);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-sharp tracking-tight flex items-center gap-3">
                        <Package className="h-8 w-8 text-primary" />
                        Fulfillment Pipeline
                    </h1>
                    <p className="text-sm font-medium text-muted">Tracking and orchestration of outbound logistics units</p>
                </div>
            </header>

            {/* Filter Hub */}
            <div className="flex bg-card p-2 rounded-[2rem] border-2 border-input-border shadow-sm overflow-x-auto no-scrollbar">
                {['ALL', 'CREATED', 'PICKED', 'PACKED', 'IN_TRANSIT', 'DELIVERED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-6 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${filterStatus === status
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-muted hover:text-sharp hover:bg-background'
                            }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Error State */}
            {error && !isLoading && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-3xl p-8 border-2 border-red-200 dark:border-red-800 animate-slide-up">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-2xl">
                            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-red-900 dark:text-red-300 mb-2">Failed to Load Shipments</h3>
                            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                        </div>
                        <Button
                            onClick={handleRetry}
                            className="bg-gradient-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </Button>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-xl"></div>
                    <p className="text-muted font-black text-[10px] uppercase tracking-widest">Querying Fulfillment Matrix...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredShipments.length === 0 ? (
                        <div className="text-center py-32 bg-card rounded-[3rem] border-2 border-dashed border-card-border">
                            <Box className="w-16 h-16 text-muted/20 mx-auto mb-6" />
                            <p className="text-muted font-black text-xs uppercase tracking-widest">Null Pipeline State</p>
                            <p className="text-[10px] text-muted/50 mt-2 font-bold uppercase tracking-widest">No matching shipment metrics found</p>
                        </div>
                    ) : (
                        filteredShipments.map((shipment) => (
                            <div key={shipment.shipmentId} className="bg-card p-8 rounded-[2.5rem] border-2 border-card-border shadow-sm hover:shadow-2xl transition-all group flex flex-col lg:flex-row gap-8 items-center justify-between">
                                <div className="flex items-center gap-6 flex-1 w-full">
                                    <div className={`p-5 rounded-2xl border-2 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ${getStatusColor(shipment.status)}`}>
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-2xl font-black text-sharp group-hover:text-primary transition-colors">{shipment.shipmentCode}</h3>
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(shipment.status)}`}>
                                                {shipment.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-2 bg-background inline-block px-2 py-1 rounded-lg border border-card-border/50 font-mono">
                                            Internal ID: #{shipment.orderId.substring(0, 13)}
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-4">
                                            {shipment.shipperId ? (
                                                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-2 rounded-xl border border-primary/10">
                                                    <Truck className="w-4 h-4" />
                                                    <span>{shippers.find(s => s.shipperId === shipment.shipperId)?.name || 'Carrier Underspecified'}</span>
                                                    {shipment.trackingNumber && (
                                                        <span className="text-primary/50 ml-2 border-l border-primary/20 pl-2">TRS: {shipment.trackingNumber}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-500/5 px-3 py-2 rounded-xl border border-amber-500/10">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>Unassigned Logistics Provider</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full lg:w-auto">
                                    {shipment.status === 'CREATED' && (
                                        <Button className="flex-1 lg:flex-none py-6 px-10 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20" onClick={() => handleStatusUpdate(shipment.shipmentId, 'PICKED')}>
                                            Initialize Picking
                                        </Button>
                                    )}
                                    {shipment.status === 'PICKED' && (
                                        <Button className="flex-1 lg:flex-none py-6 px-10 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20" onClick={() => handleStatusUpdate(shipment.shipmentId, 'PACKED')}>
                                            Seal & Containerize
                                        </Button>
                                    )}
                                    {shipment.status === 'PACKED' && (
                                        <Button className="flex-1 lg:flex-none py-6 px-10 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20" onClick={() => handleStatusUpdate(shipment.shipmentId, 'DISPATCHED')}>
                                            Finalize Dispatch
                                            <ArrowRight className="w-4 h-4 ml-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
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
