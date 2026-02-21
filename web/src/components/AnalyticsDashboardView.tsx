import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '../services/AnalyticsService';
import type { DashboardSummaryResponse, SystemHealthResponse as SystemHealth } from '@/types/api';
import { RefreshCw, Activity } from 'lucide-react';
import { SystemHealthService } from '../services/SystemHealthService';
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
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorState from './ui/ErrorState';

import { Button } from './ui/Button';

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
            console.error("Error fetching analytics:", err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) return <LoadingSpinner message="Querying intelligence matrix..." />;
    if (error) return <ErrorState title="Telemetry Error" message={error} onRetry={fetchData} />;
    if (!data) return <ErrorState title="System Idle" message="No operational data available for indexing." onRetry={fetchData} />;

    return (
        <div className="p-10 space-y-12 bg-background min-h-screen animate-in fade-in duration-700">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-sharp tracking-tighter flex items-center gap-5">
                        <div className="p-4 bg-primary/10 rounded-[2rem] text-primary">
                            <Activity className="h-10 w-10" />
                        </div>
                        Intelligence Command
                    </h1>
                    <div className="flex items-center gap-4 pl-1">
                        <SystemHealthPanel health={health} />
                    </div>
                </div>
                <Button
                    onClick={fetchData}
                    isLoading={loading}
                    className="h-16 px-10 shadow-2xl shadow-primary/30 group"
                >
                    <RefreshCw size={20} className={`mr-3 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                    Sync Intelligence Matrix
                </Button>
            </header>

            {/* Global KPI Matrix */}
            <DashboardSummary summary={data} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <StockTurnoverChart data={data.topMovers} />
                <FulfillmentMetrics data={data.fulfillmentMetrics} />
            </div>

            {/* Block Utilization Intelligence */}
            <div className="relative">
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-1 h-24 bg-primary/20 rounded-full" />
                <BlockUtilizationChart data={data.highUtilizationBlocks} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <InventoryAgingTable data={data.agingInventory} />
                <BottleneckTable data={data.stuckOrders} />
            </div>

            {/* Team Load Balancing */}
            <TeamWorkloadPanel data={data.pickerWorkload} />

            {/* Predictive Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
                <StockConfidenceMatrix data={data.stockConfidence} />
                <LogisticsRiskTable data={data.shipmentRisk} />
            </div>
        </div>
    );
};

export default AnalyticsDashboardView;
