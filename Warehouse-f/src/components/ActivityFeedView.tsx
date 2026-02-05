'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Activity, TrendingUp, TrendingDown, ArrowRightLeft, Package, AlertCircle, CheckCircle } from 'lucide-react';

interface StockMovement {
    movementId: string;
    product: {
        productId: string;
        name: string;
        sku: string;
    };
    fromBlockId?: string;
    fromBlockName?: string;
    toBlockId?: string;
    toBlockName?: string;
    quantity: number;
    movementType: 'INBOUND' | 'PUTAWAY' | 'PICK' | 'TRANSFER' | 'ADJUSTMENT' | 'OUTBOUND';
    referenceType?: string;
    referenceId?: string;
    notes?: string;
    createdBy: string;
    createdAt: number;
}

const movementTypeConfig = {
    INBOUND: { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Inbound' },
    PUTAWAY: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Putaway' },
    PICK: { icon: TrendingDown, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Pick' },
    TRANSFER: { icon: ArrowRightLeft, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Transfer' },
    ADJUSTMENT: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Adjustment' },
    OUTBOUND: { icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', label: 'Outbound' },
};

export default function ActivityFeedView() {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(50);

    useEffect(() => {
        fetchMovements();
    }, [limit]);

    const fetchMovements = async () => {
        try {
            const response = await api.get(`/stock-movements/recent?limit=${limit}`);
            setMovements(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch activity feed');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-muted font-medium">Loading activity feed...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-3xl font-black text-sharp tracking-tight flex items-center gap-3">
                        <Activity className="h-7 w-7 text-primary" />
                        Activity Feed
                    </h3>
                    <p className="text-sm font-medium text-muted">Real-time logistics movement tracking</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="px-6 py-3 bg-card border-2 border-input-border rounded-xl text-xs font-black uppercase tracking-widest text-sharp focus:outline-none focus:ring-2 focus:ring-primary transition-all outline-none"
                    >
                        <option value={25}>Show 25</option>
                        <option value={50}>Show 50</option>
                        <option value={100}>Show 100</option>
                    </select>
                </div>
            </header>

            {movements.length === 0 ? (
                <div className="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-card-border">
                    <Activity className="h-16 w-16 text-muted/20 mx-auto mb-6" />
                    <p className="text-muted font-black uppercase tracking-widest text-xs">No stock movements found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {movements.map((movement) => {
                        const config = movementTypeConfig[movement.movementType];
                        const Icon = config.icon;

                        return (
                            <div
                                key={movement.movementId}
                                className="bg-card p-6 rounded-3xl border border-card-border hover:shadow-xl hover:shadow-primary/5 transition-all group"
                            >
                                <div className="flex items-start gap-6">
                                    {/* Icon */}
                                    <div className={`p-4 rounded-2xl ${config.bg} ${config.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="min-w-0">
                                                <p className="font-black text-sharp text-lg truncate leading-tight">
                                                    {movement.product.name}
                                                </p>
                                                <p className="text-[10px] text-muted font-black uppercase tracking-widest mt-1">SKU: {movement.product.sku}</p>
                                            </div>
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${config.bg} ${config.color} border border-current/10 whitespace-now nowrap`}>
                                                {config.label}
                                            </span>
                                        </div>

                                        {/* Movement Details */}
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-sharp mb-4">
                                            <span className="font-black px-2 py-1 bg-primary/5 rounded-lg text-primary">{movement.quantity} units</span>
                                            {movement.fromBlockName && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-muted uppercase">From</span>
                                                    <span className="font-black">{movement.fromBlockName}</span>
                                                </div>
                                            )}
                                            {movement.fromBlockName && movement.toBlockName && <span className="text-muted">→</span>}
                                            {movement.toBlockName && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-muted uppercase">To</span>
                                                    <span className="font-black">{movement.toBlockName}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Notes & Reference */}
                                        <div className="flex flex-col gap-2 p-4 bg-background/50 rounded-2xl border border-card-border/50">
                                            {movement.notes && (
                                                <p className="text-xs text-muted italic">"{movement.notes}"</p>
                                            )}
                                            {movement.referenceType && (
                                                <p className="text-[10px] text-muted font-mono font-bold uppercase tracking-tighter">
                                                    Ref: {movement.referenceType} # {movement.referenceId?.substring(0, 8)}
                                                </p>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-card-border/50">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted">
                                                <span>Operator: {movement.createdBy}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{formatDate(movement.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
