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
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="text-gray-500 font-medium">Loading activity feed...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <Activity className="h-6 w-6 text-indigo-600" />
                        Activity Feed
                    </h3>
                    <p className="text-sm font-medium text-gray-400">Real-time stock movement tracking</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value={25}>Last 25</option>
                        <option value={50}>Last 50</option>
                        <option value={100}>Last 100</option>
                    </select>
                </div>
            </header>

            {movements.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No stock movements yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {movements.map((movement) => {
                        const config = movementTypeConfig[movement.movementType];
                        const Icon = config.icon;

                        return (
                            <div
                                key={movement.movementId}
                                className={`bg-white p-4 rounded-xl border ${config.border} hover:shadow-md transition-all`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 text-sm">
                                                    {movement.product.name}
                                                </p>
                                                <p className="text-xs text-gray-400 font-mono">{movement.product.sku}</p>
                                            </div>
                                            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                                                {config.label}
                                            </span>
                                        </div>

                                        {/* Movement Details */}
                                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                            <span className="font-bold">{movement.quantity} units</span>
                                            {movement.fromBlockName && (
                                                <>
                                                    <span className="text-gray-400">from</span>
                                                    <span className="font-medium text-gray-700">{movement.fromBlockName}</span>
                                                </>
                                            )}
                                            {movement.toBlockName && (
                                                <>
                                                    <span className="text-gray-400">to</span>
                                                    <span className="font-medium text-gray-700">{movement.toBlockName}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Notes & Reference */}
                                        {movement.notes && (
                                            <p className="text-xs text-gray-500 italic mb-1">{movement.notes}</p>
                                        )}
                                        {movement.referenceType && movement.referenceId && (
                                            <p className="text-[10px] text-gray-400 font-mono">
                                                Ref: {movement.referenceType} #{movement.referenceId.substring(0, 8)}
                                            </p>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                                            <span>By {movement.createdBy}</span>
                                            <span>•</span>
                                            <span>{formatDate(movement.createdAt)}</span>
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
