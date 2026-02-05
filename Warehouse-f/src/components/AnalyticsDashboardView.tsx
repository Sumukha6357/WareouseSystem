'use client';

import React, { useEffect, useState } from 'react';
import { AnalyticsService, DashboardSummaryResponse } from '../services/AnalyticsService';
import { RefreshCw, Activity } from 'lucide-react';
import { SystemHealthService, SystemHealth } from '../services/SystemHealthService';
import SystemHealthPanel from './analytics/SystemHealthPanel';
import DashboardSummary from './analytics/DashboardSummary';
import StockTurnoverChart from './analytics/StockTurnoverChart';
import FulfillmentMetrics from './analytics/FulfillmentMetrics';
import BlockUtilizationChart from './analytics/BlockUtilizationChart';
import InventoryAgingTable from './analytics/InventoryAgingTable';
import BottleneckTable from './analytics/BottleneckTable';
import TeamWorkloadPanel from './analytics/TeamWorkloadPanel';
import StockConfidenceMatrix from './analytics/StockConfidenceMatrix';
import LogisticsRiskTable from './analytics/LogisticsRiskTable';

const AnalyticsDashboardView: React.FC = () => {
    const [data, setData] = useState<DashboardSummaryResponse | null>(null);
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [result, healthStats] = await Promise.all([
                AnalyticsService.getDashboardSummary(),
                SystemHealthService.getStats()
            ]);
            setData(result);
            setHealth(healthStats);
            setError(null);
        } catch (err) {
            setError('Failed to load analytics data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) return <div className="p-8 text-center">Loading analytics...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!data) return null;

    return (
        <div className="p-8 space-y-10 bg-background min-h-screen animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4">
                        <Activity className="h-10 w-10 text-primary" />
                        Intelligence Command
                    </h1>
                    <SystemHealthPanel health={health} />
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center space-x-3 px-8 h-14 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:opacity-90 transition-all shadow-2xl shadow-primary/30 group"
                >
                    <RefreshCw size={18} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    <span>Resync Metrics</span>
                </button>
            </div>

            {/* Global KPI Matrix */}
            <DashboardSummary summary={data} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <StockTurnoverChart data={data.topMovers} />
                <FulfillmentMetrics data={data.fulfillmentMetrics} />
            </div>

            {/* Block Utilization Intelligence */}
            <BlockUtilizationChart data={data.highUtilizationBlocks} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10">
                <InventoryAgingTable data={data.agingInventory} />
                <BottleneckTable data={data.stuckOrders} />
            </div>

            {/* Team Load Balancing */}
            <TeamWorkloadPanel data={data.pickerWorkload} />

            {/* Predictive Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">
                <StockConfidenceMatrix data={data.stockConfidence} />
                <LogisticsRiskTable data={data.shipmentRisk} />
            </div>
        </div>
    );
};

export default AnalyticsDashboardView;
