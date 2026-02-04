'use client';

import React, { useEffect, useState } from 'react';
import { AnalyticsService, DashboardSummaryResponse } from '../services/AnalyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, Package, Truck, Clock, AlertTriangle, Activity, Wifi, ShieldCheck } from 'lucide-react';
import { SystemHealthService, SystemHealth } from '../services/SystemHealthService';

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

    const { shipmentMetrics, fulfillmentMetrics, topMovers, highUtilizationBlocks } = data;

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Warehouse Analytics</h1>
                    {health && (
                        <div className="flex items-center gap-4 mt-1">
                            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${health.systemStatus === 'OPTIMAL' ? 'bg-green-100 text-green-700' :
                                health.systemStatus === 'STRESSED' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700 animate-pulse'
                                }`}>
                                <Activity size={12} />
                                Status: {health.systemStatus}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                                <Clock size={12} />
                                Latency: {health.apiLatencyMs.toFixed(0)}ms
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                                <Wifi size={12} />
                                WS sessions: {health.webSocketSessions}
                            </span>
                        </div>
                    )}
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">In Transit</p>
                        <p className="text-2xl font-bold">{shipmentMetrics.shipmentsInTransit}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <Truck size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Delivered Today</p>
                        <p className="text-2xl font-bold">{shipmentMetrics.deliveredToday}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Avg Fulfillment</p>
                        <p className="text-2xl font-bold">{fulfillmentMetrics.avgTotalFulfillmentTimeMinutes?.toFixed(1)} m</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Failed/Returned</p>
                        <p className="text-2xl font-bold">{shipmentMetrics.failedShipments}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stock Turnover Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Top Moving Products</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topMovers} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="productName" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="totalMovements" fill="#3B82F6" name="Movements" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fulfillment Time Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Fulfillment Time Breakdown (min)</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { name: 'Pick', time: fulfillmentMetrics.avgPickTimeMinutes },
                                    { name: 'Pack', time: fulfillmentMetrics.avgPackTimeMinutes },
                                    { name: 'Dispatch', time: fulfillmentMetrics.avgDispatchTimeMinutes }
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="time" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Block Utilization */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <ShieldCheck className="text-blue-500" size={20} />
                    High Utilization Blocks (Capacity Guard)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {highUtilizationBlocks.length > 0 ? (
                        highUtilizationBlocks.map((block) => (
                            <div key={block.blockId} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-gray-800 text-sm">{block.blockName}</span>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${block.occupancyPercentage >= 90 ? 'bg-red-200 text-red-800' :
                                        block.occupancyPercentage >= 70 ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                                        }`}>
                                        {block.utilizationLevel}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                    <div
                                        className={`h-2.5 rounded-full transition-all duration-1000 ${block.occupancyPercentage >= 90 ? 'bg-red-500' :
                                            block.occupancyPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${Math.min(100, block.occupancyPercentage)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold">
                                    <span>Occupied: {block.occupancyPercentage.toFixed(1)}%</span>
                                    <span>Available: {(100 - block.occupancyPercentage).toFixed(1)}%</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-10 text-center text-gray-400 font-medium bg-gray-50 rounded-xl border border-dashed">
                            No high utilization blocks detected.
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {/* Inventory Aging */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Clock className="text-orange-500" size={20} />
                        Inventory Aging (Oldest Stock)
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Block</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.agingInventory && data.agingInventory.length > 0 ? (
                                    data.agingInventory.map((item) => (
                                        <tr key={item.inventoryId}>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{item.blockName}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-orange-600">{item.daysInWarehouse} days</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-3 text-center text-sm text-gray-500">No aging inventory found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stuck Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={20} />
                        Operational Bottlenecks (Stuck Orders)
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Wait Time</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.stuckOrders && data.stuckOrders.length > 0 ? (
                                    data.stuckOrders.map((order) => (
                                        <tr key={order.orderId}>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status === 'PENDING' ? 'bg-gray-100 text-gray-800' :
                                                    order.status === 'PICKED' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-bold text-red-600">
                                                {order.hoursInState.toFixed(1)} hrs
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-3 text-center text-sm text-green-600">All orders moving smoothly!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Human Intelligence: Team Pulse */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">👥</span>
                    Team Pulse (Picker Workload)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.pickerWorkload && data.pickerWorkload.length > 0 ? (
                        data.pickerWorkload.map((picker) => (
                            <div key={picker.username} className={`p-4 rounded-lg border flex flex-col gap-2 ${picker.status === 'OVERLOADED' ? 'bg-red-50 border-red-200' :
                                picker.status === 'ACTIVE' ? 'bg-green-50 border-green-200' :
                                    'bg-gray-50 border-gray-200'
                                }`}>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-800">{picker.username}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${picker.status === 'OVERLOADED' ? 'bg-red-200 text-red-800' :
                                        picker.status === 'ACTIVE' ? 'bg-green-200 text-green-800' :
                                            'bg-gray-200 text-gray-600'
                                        }`}>
                                        {picker.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <div className="text-center">
                                        <p className="text-gray-500 text-xs text-left">Active Tasks</p>
                                        <p className="font-bold text-lg text-left">{picker.activeTaskCount}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-500 text-xs text-right">Completed Today</p>
                                        <p className="font-bold text-lg text-right">{picker.completedTodayCount}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 text-center py-4 text-gray-500">
                            No active staff online
                        </div>
                    )}
                </div>
            </div>

            {/* Predictive Intelligence: Trust & Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {/* Trust Center (Stock Confidence) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <span className="text-2xl">🛡️</span>
                        Trust Center (Stock Confidence)
                    </h2>
                    <div className="space-y-4">
                        {data.stockConfidence && data.stockConfidence.length > 0 ? (
                            data.stockConfidence.map((stock) => (
                                <div key={stock.productId} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-800">{stock.productName}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stock.confidenceLevel === 'HIGH' ? 'bg-green-100 text-green-700' :
                                            stock.confidenceLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {stock.confidenceScore}% Confidence
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${stock.confidenceLevel === 'HIGH' ? 'bg-green-500' :
                                                stock.confidenceLevel === 'MEDIUM' ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                            style={{ width: `${stock.confidenceScore}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Reason: {stock.reason}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">All stock verified recently!</div>
                        )}
                    </div>
                </div>

                {/* Risk Radar (Shipment Risk) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <span className="text-2xl">📡</span>
                        Risk Radar (Predicted Delays)
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.shipmentRisk && data.shipmentRisk.length > 0 ? (
                                    data.shipmentRisk.map((shipment) => (
                                        <tr key={shipment.shipmentId}>
                                            <td className="px-4 py-3 text-sm font-medium text-blue-600">{shipment.trackingNumber || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${shipment.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700 animate-pulse' :
                                                    'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {shipment.riskLevel}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{shipment.detectedIssue}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-6 text-center text-sm text-green-600">
                                            No high-risk shipments detected.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboardView;
