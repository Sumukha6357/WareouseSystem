'use client';

import React, { useState, useEffect } from 'react';
import { ShipmentService } from '@/services/ShipmentService';
import { ShipperService } from '@/services/ShipperService';
import type { ShipmentResponse as Shipment, ShipperResponse as Shipper } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Package, Truck, ArrowRight, MapPin, Box, CheckCircle2 } from 'lucide-react';
import { notify } from '@/lib/notify';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorState from './ui/ErrorState';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { useWebSocket } from '@/hooks/useWebSocket';
import { cn } from '@/lib/utils';

export default function ShipmentManagementView() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [shippers, setShippers] = useState<Shipper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');

    useEffect(() => {
        loadData();
    }, []);

    // WebSocket Integration for real-time shipment updates
    useWebSocket('/topic/shipments', () => {
        console.log('Shipment update received');
        loadData();
    });

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
        } catch (error: unknown) {
            console.error('Failed to load data:', error);
            setError(error instanceof Error ? error.message : 'Failed to load shipment data. Please try again.');
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
            notify.success(`Shipment updated to ${newStatus}`);
            loadData();
        } catch (error) {
            console.error('Failed to update status:', error);
            notify.error('Failed to update status');
        }
    };

    const getStatusVariant = (status: string): "primary" | "secondary" | "success" | "warning" | "danger" | "outline" => {
        switch (status) {
            case 'CREATED': return 'primary';
            case 'PICKED': return 'warning';
            case 'READY_TO_DISPATCH': return 'secondary';
            case 'DISPATCHED':
            case 'IN_TRANSIT': return 'primary';
            case 'DELIVERED': return 'success';
            default: return 'outline';
        }
    };

    const filteredShipments = filterStatus === 'ALL'
        ? shipments
        : shipments.filter(s => s.status === filterStatus);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4 italic uppercase">
                        <Package className="h-10 w-10 text-primary" />
                        Fulfillment Pipeline
                    </h1>
                    <p className="text-sm font-medium text-muted mt-2">Real-time orchestration and telemetry of outbound logistics units.</p>
                </div>
            </header>

            {/* Filter Hub */}
            <div className="flex bg-card/80 backdrop-blur-md p-2 rounded-[2rem] border-2 border-card-border shadow-xl overflow-x-auto no-scrollbar scroll-smooth">
                {['ALL', 'CREATED', 'PICKED', 'PACKED', 'READY_TO_DISPATCH', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED'].map((status) => (
                    <Button
                        key={status}
                        variant={filterStatus === status ? 'primary' : 'ghost'}
                        onClick={() => setFilterStatus(status)}
                        className={cn(
                            "px-8 py-3.5 rounded-[1.25rem] text-[10px] whitespace-nowrap",
                            filterStatus === status && "shadow-lg shadow-primary/25"
                        )}
                        aria-pressed={filterStatus === status}
                    >
                        {status.replace('_', ' ')}
                    </Button>
                ))}
            </div>

            {isLoading && shipments.length === 0 ? (
                <LoadingSpinner message="Querying Fulfillment Matrix..." />
            ) : error ? (
                <ErrorState message={error} onRetry={handleRetry} />
            ) : (
                <div className="grid grid-cols-1 gap-8 pt-2">
                    {filteredShipments.length === 0 ? (
                        <div className="text-center py-40 bg-card/30 rounded-[4rem] border-4 border-dashed border-card-border">
                            <Box className="w-20 h-20 text-muted/10 mx-auto mb-8" />
                            <p className="text-muted font-black text-sm uppercase tracking-[0.5em]">Null Pipeline Condition</p>
                            <p className="text-[10px] text-muted/40 mt-6 font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed italic">
                                No active logistics units detected matching your current query parameters.
                            </p>
                        </div>
                    ) : (
                        filteredShipments.map((shipment) => (
                            <Card key={shipment.shipmentId} className="p-0 overflow-hidden hover:border-primary/30 group">
                                <div className="p-8 flex flex-col lg:flex-row gap-10 items-center justify-between">
                                    <div className="flex items-center gap-8 flex-1 w-full">
                                        <div className="relative">
                                            <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-background/50 border-card-border/50`}>
                                                <Package className="w-10 h-10 text-primary" />
                                            </div>
                                            {shipment.status === 'DELIVERED' && (
                                                <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1.5 shadow-lg border-4 border-card">
                                                    <CheckCircle2 size={12} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-4">
                                                <h3 className="text-3xl font-black text-sharp group-hover:text-primary transition-colors italic uppercase tracking-tighter">
                                                    {shipment.shipmentCode}
                                                </h3>
                                                <Badge variant={getStatusVariant(shipment.status)} className="h-7 px-4">
                                                    {shipment.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6 mt-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-muted uppercase tracking-widest leading-none mb-1">Entity ID</span>
                                                    <code className="text-[10px] font-bold text-sharp bg-background/50 px-3 py-1.5 rounded-xl border border-card-border/50 uppercase tracking-widest">
                                                        #{shipment.orderId.substring(0, 13)}
                                                    </code>
                                                </div>

                                                <div className="h-8 w-px bg-card-border/50 hidden md:block" />

                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-muted uppercase tracking-widest leading-none mb-1">Carrier Network</span>
                                                    {shipment.shipperId ? (
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-xl border border-primary/10">
                                                            <Truck className="w-3.5 h-3.5" />
                                                            <span>{shippers.find(s => s.shipperId === shipment.shipperId)?.name || 'Carrier Node'}</span>
                                                            {shipment.trackingNumber && (
                                                                <span className="text-primary/40 ml-2 pl-2 border-l border-primary/10 font-mono tracking-tighter">
                                                                    {shipment.trackingNumber}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-500/5 px-4 py-1.5 rounded-xl border border-amber-500/20">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span>Logistics Assignment Pending</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 w-full lg:w-auto shrink-0">
                                        {shipment.status === 'CREATED' && (
                                            <Button
                                                className="flex-1 lg:flex-none h-16 px-12 text-[10px] shadow-2xl shadow-primary/30"
                                                onClick={() => handleStatusUpdate(shipment.shipmentId, 'PICKED')}
                                            >
                                                Initialize Picking
                                            </Button>
                                        )}
                                        {shipment.status === 'PICKED' && (
                                            <Button
                                                className="flex-1 lg:flex-none h-16 px-12 text-[10px] shadow-2xl shadow-primary/30"
                                                onClick={() => handleStatusUpdate(shipment.shipmentId, 'PACKED')}
                                            >
                                                Seal & Containerize
                                            </Button>
                                        )}
                                        {shipment.status === 'PACKED' && (
                                            <Button
                                                className="flex-1 lg:flex-none h-16 px-12 text-[10px] shadow-2xl shadow-primary/30"
                                                onClick={() => handleStatusUpdate(shipment.shipmentId, 'READY_TO_DISPATCH')}
                                            >
                                                Stage for Dispatch
                                                <ArrowRight className="w-4 h-4 ml-3" />
                                            </Button>
                                        )}
                                        {shipment.status === 'READY_TO_DISPATCH' && (
                                            <Button
                                                variant="secondary"
                                                className="flex-1 lg:flex-none h-16 px-12 text-[10px] shadow-2xl shadow-sharp/40"
                                                onClick={() => handleStatusUpdate(shipment.shipmentId, 'DISPATCHED')}
                                            >
                                                Finalize Dispatch
                                                <Truck className="w-4 h-4 ml-3" />
                                            </Button>
                                        )}
                                        {shipment.status === 'DISPATCHED' && (
                                            <Button
                                                className="flex-1 lg:flex-none h-16 px-12 text-[10px] shadow-2xl shadow-primary/30"
                                                onClick={() => handleStatusUpdate(shipment.shipmentId, 'IN_TRANSIT')}
                                            >
                                                Confirm Transit Start
                                                <ArrowRight className="w-4 h-4 ml-3" />
                                            </Button>
                                        )}
                                        {shipment.status === 'IN_TRANSIT' && (
                                            <Button
                                                className="flex-1 lg:flex-none h-16 px-12 text-[10px] shadow-2xl shadow-emerald-500/30 bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                                                onClick={() => handleStatusUpdate(shipment.shipmentId, 'DELIVERED')}
                                            >
                                                Log Delivery Confirmation
                                                <CheckCircle2 className="w-4 h-4 ml-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
