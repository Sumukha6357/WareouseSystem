import React from 'react';
import { Package, Truck, Clock, AlertTriangle } from 'lucide-react';
import type { DashboardSummaryResponse } from '@/types/api';
import { Card } from '../ui/Card';

interface DashboardSummaryProps {
    summary: DashboardSummaryResponse;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ summary }) => {
    const { shipmentMetrics, fulfillmentMetrics } = summary;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { label: 'Units In Transit', value: shipmentMetrics.shipmentsInTransit, icon: Package, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' },
                { label: 'Delivered Today', value: shipmentMetrics.deliveredToday, icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
                { label: 'Avg Fulfillment Cycle', value: `${fulfillmentMetrics.avgTotalFulfillmentTimeMinutes?.toFixed(1)}M`, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-500/5', border: 'border-indigo-500/20' },
                { label: 'Critical Exceptions', value: shipmentMetrics.failedShipments, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/20' },
            ].map((kpi, idx) => (
                <Card key={idx} className={`p-8 border-2 shadow-sm flex items-center space-x-6 hover:shadow-2xl hover:border-primary/20 hover:-translate-y-2 transition-all cursor-default overflow-visible relative group ${kpi.border}`}>
                    <div className={`p-5 rounded-3xl border-2 shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ${kpi.bg} ${kpi.color} ${kpi.border}`}>
                        <kpi.icon size={32} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-2 leading-none">{kpi.label}</p>
                        <p className="text-4xl font-black text-sharp tracking-tighter truncate">{kpi.value}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default DashboardSummary;
