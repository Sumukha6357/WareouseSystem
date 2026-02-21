import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import type { FulfillmentMetricsResponse } from '@/types/api';

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
        <Card className="shadow-sm overflow-visible">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-4 text-sharp italic">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600">
                        <Activity size={20} />
                    </div>
                    Efficiency Diagnostics (MIN)
                </CardTitle>
            </CardHeader>
            <CardContent className="h-80 pt-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="0" vertical={false} stroke="var(--card-border)" strokeOpacity={0.3} />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 9, fontWeight: 900, fill: 'var(--text-muted)' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: 'var(--text-muted)' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '1.5rem', border: '2px solid var(--card-border)', fontWeight: 900, fontSize: '11px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="time" fill="#10B981" radius={[12, 12, 0, 0]} barSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default FulfillmentMetrics;
