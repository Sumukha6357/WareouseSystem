'use client';

import React, { useCallback, useEffect, useState } from 'react';
import httpClient from '@/lib/httpClient';
import type { StockMovementResponse } from '@/types/api';
import { notify } from '@/lib/notify';
import { Activity, TrendingUp, TrendingDown, ArrowRightLeft, Package, AlertCircle, CheckCircle, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const movementTypeConfig = {
    INBOUND: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Inbound' },
    PUTAWAY: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Putaway' },
    PICK: { icon: TrendingDown, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pick' },
    TRANSFER: { icon: ArrowRightLeft, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: 'Transfer' },
    ADJUSTMENT: { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Adjustment' },
    OUTBOUND: { icon: CheckCircle, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', label: 'Outbound' },
};

export default function ActivityFeedView() {
    const [movements, setMovements] = useState<StockMovementResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(50);

    const fetchMovements = useCallback(async () => {
        try {
            const data = await httpClient.get<StockMovementResponse[]>(`/stock-movements/recent?limit=${limit}`);
            setMovements(data);
        } catch {
            notify.error('Failed to fetch activity feed');
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchMovements();
    }, [fetchMovements]);

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
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <h3 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4 italic uppercase">
                        <Activity className="h-10 w-10 text-primary" />
                        Logistics Ledger
                    </h3>
                    <p className="text-sm font-medium text-muted mt-2">Historical capture of autonomous and manual stock transitions.</p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative group w-full lg:w-64">
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="w-full px-8 py-4 bg-card border-2 border-card-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-sharp focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none shadow-sm cursor-pointer"
                        >
                            <option value={25}>Buffer: 25 Entities</option>
                            <option value={50}>Buffer: 50 Entities</option>
                            <option value={100}>Buffer: 100 Entities</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-primary transition-colors">
                            <Activity className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </header>

            {movements.length === 0 ? (
                <div className="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-card-border">
                    <Activity className="h-16 w-16 text-muted/20 mx-auto mb-6" />
                    <p className="text-muted font-black uppercase tracking-widest text-xs">No stock movements found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {movements.map((movement) => {
                        const movType = movement.movementType as keyof typeof movementTypeConfig;
                        const config = movementTypeConfig[movType] ?? movementTypeConfig.ADJUSTMENT;
                        const Icon = config.icon;

                        return (
                            <Card
                                key={movement.movementId}
                                className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-x-1"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                    {/* Status Badge & Icon */}
                                    <div className="flex items-center gap-6 shrink-0">
                                        <div className={`p-5 rounded-[2rem] ${config.bg} ${config.color} border-2 ${config.border} shadow-xl shadow-black/5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                            <Icon className="h-8 w-8" />
                                        </div>
                                        <div className="lg:hidden">
                                            <p className="text-xl font-black text-sharp italic uppercase tracking-tighter">{movement.product.name}</p>
                                            <Badge variant="ghost" className="h-6 px-0 text-[10px] opacity-60">SKU: {movement.product.sku}</Badge>
                                        </div>
                                    </div>

                                    {/* Primary Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="hidden lg:block mb-1">
                                            <p className="text-2xl font-black text-sharp italic uppercase tracking-tighter group-hover:text-primary transition-colors duration-300">{movement.product.name}</p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-6 mt-4 lg:mt-0">
                                            <div className="flex items-center gap-3 bg-background/50 px-4 py-2 rounded-2xl border border-card-border/50">
                                                <div className={`h-2 w-2 rounded-full ${config.color.replace('text-', 'bg-')} animate-pulse`}></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{config.label}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-muted uppercase tracking-widest leading-none">Payload:</span>
                                                <span className="text-lg font-black text-sharp tabular-nums">{movement.quantity} <span className="text-[10px] opacity-40 lowercase">units</span></span>
                                            </div>

                                            {(movement.fromBlockName || movement.toBlockName) && (
                                                <div className="flex items-center gap-4 bg-background/30 px-5 py-2.5 rounded-2xl border border-card-border/30">
                                                    {movement.fromBlockName && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black text-muted uppercase">From</span>
                                                            <span className="text-xs font-black text-primary">{movement.fromBlockName}</span>
                                                        </div>
                                                    )}
                                                    {movement.fromBlockName && movement.toBlockName && (
                                                        <ArrowRightLeft className="h-3 w-3 text-muted/30" />
                                                    )}
                                                    {movement.toBlockName && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black text-muted uppercase">To</span>
                                                            <span className="text-xs font-black text-emerald-500">{movement.toBlockName}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {movement.notes && (
                                            <div className="mt-6 p-4 bg-primary/5 rounded-2xl border-l-[6px] border-primary/20 italic text-xs text-muted font-medium">
                                                &quot;{movement.notes}&quot;
                                            </div>
                                        )}
                                    </div>

                                    {/* Metadata & Footer */}
                                    <div className="flex flex-col lg:items-end gap-6 shrink-0 lg:pl-8 lg:border-l border-card-border/50 pt-6 lg:pt-0 border-t lg:border-t-0 mt-6 lg:mt-0">
                                        <div className="flex items-center gap-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Authorization</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-lg bg-background border border-card-border/50 flex items-center justify-center">
                                                        <User className="h-3 w-3 text-primary/60" />
                                                    </div>
                                                    <span className="text-xs font-black text-sharp">{movement.createdBy}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 justify-end">
                                            <Clock className="h-3 w-3 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{formatDate(movement.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
