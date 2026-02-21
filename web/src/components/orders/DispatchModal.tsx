'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Truck } from 'lucide-react';

interface Shipper {
    shipperId: string;
    name: string;
    serviceLevel: string;
}

interface Warehouse {
    warehouseId: string;
    name: string;
}

interface DispatchModalProps {
    shippers: Shipper[];
    warehouses: Warehouse[];
    shipperId: string;
    warehouseId: string;
    trackingNumber: string;
    onShipperChange: (shipperId: string) => void;
    onWarehouseChange: (warehouseId: string) => void;
    onTrackingNumberChange: (trackingNumber: string) => void;
    onDispatch: () => void;
    onClose: () => void;
    isLoading?: boolean;
}

export default function DispatchModal({
    shippers,
    warehouses,
    shipperId,
    warehouseId,
    trackingNumber,
    onShipperChange,
    onWarehouseChange,
    onTrackingNumberChange,
    onDispatch,
    onClose,
    isLoading = false
}: DispatchModalProps) {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Exit Logistics"
            maxWidth="xl"
        >
            <div className="space-y-10">
                <p className="text-sm font-medium text-muted">
                    Initiate outward transport protocol
                </p>

                <div className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-3 ml-1">Logistics Carrier</label>
                        <select
                            value={shipperId}
                            onChange={(e) => onShipperChange(e.target.value)}
                            className="w-full px-6 py-4 bg-background border-2 border-input-border rounded-2xl text-sharp font-black uppercase tracking-widest text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-pointer"
                        >
                            <option value="">-- SELECT_CARRIER --</option>
                            {shippers.map(s => (
                                <option key={s.shipperId} value={s.shipperId}>
                                    {s.name} [{s.serviceLevel.replace('_', ' ')}]
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-3 ml-1">Origin Node</label>
                        <select
                            value={warehouseId}
                            onChange={(e) => onWarehouseChange(e.target.value)}
                            className="w-full px-6 py-4 bg-background border-2 border-input-border rounded-2xl text-sharp font-black uppercase tracking-widest text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-pointer"
                        >
                            <option value="">-- SELECT_ORIGIN_WAREHOUSE --</option>
                            {warehouses.map(w => (
                                <option key={w.warehouseId} value={w.warehouseId}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Logistics Telemetry (Tracking)"
                        placeholder="AUTOGEN_IF_EMPTY"
                        value={trackingNumber}
                        onChange={(e) => onTrackingNumberChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-3 pt-10 border-t border-card-border/30">
                    <Button
                        onClick={onDispatch}
                        className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-xs font-black uppercase tracking-widest h-14"
                        isLoading={isLoading}
                    >
                        Execute Dispatch
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full py-4 text-[10px] font-black uppercase tracking-widest"
                    >
                        Stand Down
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
