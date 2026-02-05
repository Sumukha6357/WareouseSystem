import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FulfillmentMetricsResponse } from '../../services/AnalyticsService';

interface FulfillmentMetricsProps {
    data: FulfillmentMetricsResponse;
}

const FulfillmentMetrics: React.FC<FulfillmentMetricsProps> = ({ data }) => {
    const chartData = [
        { name: 'PICKING', time: data.avgPickTimeMinutes },
        { name: 'PACKING', time: data.avgPackTimeMinutes },
        { name: 'DISPATCH', time: data.avgDispatchTimeMinutes }
    ];

    return (
        <div className="bg-card p-10 rounded-[3.5rem] border-2 border-card-border shadow-sm">
            <h2 className="text-xl font-black text-sharp mb-8 uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-10 bg-emerald-500 rounded-full" />
                Efficiency Metrics (MIN)
            </h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="0" vertical={false} stroke="var(--card-border)" strokeOpacity={0.5} />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--text-muted)' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--text-muted)' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '1.5rem', border: '2px solid var(--input-border)', fontWeight: 900, fontSize: '12px' }}
                        />
                        <Bar dataKey="time" fill="#10B981" radius={[15, 15, 0, 0]} barSize={60} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FulfillmentMetrics;
