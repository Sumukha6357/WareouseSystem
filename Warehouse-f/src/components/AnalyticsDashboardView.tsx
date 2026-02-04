import React, { useEffect, useState } from 'react';
import { AnalyticsService, DashboardSummaryResponse } from '../services/AnalyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { RefreshCw, Package, Truck, Clock, AlertTriangle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboardView: React.FC = () => {
    const [data, setData] = useState<DashboardSummaryResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await AnalyticsService.getDashboardSummary();
            setData(result);
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
                <h1 className="text-2xl font-bold text-gray-800">Warehouse Analytics</h1>
                <button
                    onClick={fetchData}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <RefreshCw size={18} />
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
                <h2 className="text-lg font-semibold mb-4 text-gray-800">High Utilization Blocks</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {highUtilizationBlocks.length > 0 ? (
                                highUtilizationBlocks.map((block) => (
                                    <tr key={block.blockId}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{block.blockName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{block.occupancyPercentage.toFixed(1)}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${block.utilizationLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
                                                    block.utilizationLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {block.utilizationLevel}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No high utilization blocks found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboardView;
