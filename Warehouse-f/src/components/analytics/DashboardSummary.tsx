import React from 'react';
import { Package, Truck, Clock, AlertTriangle } from 'lucide-react';
import { DashboardSummaryResponse } from '../../services/AnalyticsService';

interface DashboardSummaryProps {
    summary: DashboardSummaryResponse;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ summary }) => {
    const { shipmentMetrics, fulfillmentMetrics } = summary;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { label: 'Units In Transit', value: shipmentMetrics.shipmentsInTransit, icon: Package, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
                { label: 'Nodes Delivered Today', value: shipmentMetrics.deliveredToday, icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
                { label: 'Avg Fulfillment Cycle', value: `${fulfillmentMetrics.avgTotalFulfillmentTimeMinutes?.toFixed(1)}M`, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-500/5', border: 'border-indigo-500/10' },
                { label: 'Critical Exceptions', value: shipmentMetrics.failedShipments, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/10' },
            ].map((kpi, idx) => (
                <div key={idx} className={`bg-card p-10 rounded-[3rem] border-2 shadow-sm flex items-center space-x-6 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-default ${kpi.border}`}>
                    <div className={`p-5 rounded-2xl border ${kpi.bg} ${kpi.color}`}>
                        <kpi.icon size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
                        <p className="text-4xl font-black text-sharp tracking-tight">{kpi.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardSummary;
