'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import {
    ShoppingBag,
    Package,
    MapPin,
    XCircle,
    ChevronRight,
    Clock,
    User,
    CheckCircle2,
    Truck,
    AlertTriangle
} from 'lucide-react';

interface PickTask {
    taskId: string;
    product: {
        productId: string;
        name: string;
        sku: string;
    };
    blockId: string;
    blockName: string;
    quantity: number;
    assignedTo: string;
    status: string;
    createdAt: number;
    completedAt?: number;
}

interface Order {
    orderId: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    status: string;
    totalItems: number;
    notes?: string;
    createdAt: number;
    pickedAt?: number;
    packedAt?: number;
    dispatchedAt?: number;
    pickTasks: PickTask[];
}

interface OrderCardProps {
    order: Order;
    onAssignPicker: (orderId: string) => void;
    onUpdateStatus: (orderId: string, action: string) => void;
    onDispatch: (orderId: string) => void;
    onCancel: (orderId: string) => void;
    onViewDetails: (order: Order) => void;
}

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        PENDING: 'bg-background text-muted border-card-border',
        PICK_ASSIGNED: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
        PICKED: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
        PACKED: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        DISPATCHED: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20'
    };
    return colors[status] || 'bg-background text-muted border-card-border';
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'PENDING': return <Clock size={12} />;
        case 'PICK_ASSIGNED': return <User size={12} />;
        case 'PICKED': return <Package size={12} />;
        case 'PACKED': return <CheckCircle2 size={12} />;
        case 'DISPATCHED': return <Truck size={12} />;
        case 'CANCELLED': return <XCircle size={12} />;
        default: return <AlertTriangle size={12} />;
    }
};

export default function OrderCard({
    order,
    onAssignPicker,
    onUpdateStatus,
    onDispatch,
    onCancel,
    onViewDetails
}: OrderCardProps) {
    return (
        <div className="bg-card border-2 border-card-border rounded-[3rem] p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4">
                <ShoppingBag size={120} className="text-primary rotate-12" />
            </div>

            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <h3 className="text-2xl font-black text-sharp group-hover:text-primary transition-colors">#{order.orderNumber}</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">{order.customerName}</p>
                </div>
                <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.replace('_', ' ')}
                </span>
            </div>

            <div className="space-y-4 mb-10 relative z-10">
                <div className="flex items-center gap-4 p-4 bg-background rounded-2xl border border-card-border/50">
                    <div className="p-2 bg-card rounded-lg border border-card-border shadow-sm text-primary">
                        <Package size={18} />
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-muted uppercase tracking-widest leading-none mb-1">Items in node</p>
                        <p className="text-sm font-black text-sharp tracking-tight">{order.totalItems} UNITS</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-background rounded-2xl border border-card-border/50">
                    <div className="p-2 bg-card rounded-lg border border-card-border shadow-sm text-primary">
                        <MapPin size={18} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[8px] font-black text-muted uppercase tracking-widest leading-none mb-1">Target Coordinates</p>
                        <p className="text-sm font-black text-sharp tracking-tight truncate">{order.shippingAddress}</p>
                    </div>
                </div>
            </div>

            {/* Action Matrix */}
            <div className="flex gap-3 flex-wrap relative z-10">
                {order.status === 'PENDING' && (
                    <Button
                        onClick={() => onAssignPicker(order.orderId)}
                        size="sm"
                        className="rounded-xl px-4 py-5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                    >
                        Deploy Picker
                    </Button>
                )}
                {order.status === 'PICK_ASSIGNED' && (
                    <Button
                        onClick={() => onUpdateStatus(order.orderId, 'mark-picked')}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 rounded-xl px-4 py-5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-600/20"
                    >
                        Finalize Pick
                    </Button>
                )}
                {order.status === 'PICKED' && (
                    <Button
                        onClick={() => onUpdateStatus(order.orderId, 'mark-packed')}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 rounded-xl px-4 py-5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-600/20"
                    >
                        Seal Container
                    </Button>
                )}
                {order.status === 'PACKED' && (
                    <Button
                        onClick={() => onDispatch(order.orderId)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-4 py-5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                    >
                        Dispatch Node
                    </Button>
                )}
                {order.status !== 'DISPATCHED' && order.status !== 'CANCELLED' && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onCancel(order.orderId)}
                        className="h-12 w-12 border-2 border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white"
                        title="Abort Transaction"
                        aria-label="Abort Transaction"
                    >
                        <XCircle size={20} />
                    </Button>
                )}
                <Button
                    variant="outline"
                    onClick={() => onViewDetails(order)}
                    className="px-6 h-12 border-2 border-input-border text-sharp hover:bg-sharp hover:text-background"
                >
                    Telemetrics
                    <ChevronRight size={14} className="ml-2" />
                </Button>
            </div>
        </div>
    );
}
