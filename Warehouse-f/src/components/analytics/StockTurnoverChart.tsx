import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockTurnoverResponse } from '../../services/AnalyticsService';

interface StockTurnoverChartProps {
    data: StockTurnoverResponse[];
}

const StockTurnoverChart: React.FC<StockTurnoverChartProps> = ({ data }) => {
    return (
        <div className="bg-card p-10 rounded-[3.5rem] border-2 border-card-border shadow-sm">
            <h2 className="text-xl font-black text-sharp mb-8 uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-10 bg-primary rounded-full" />
                Stock Velocity Chart
            </h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="0" horizontal={false} vertical={true} stroke="var(--card-border)" strokeOpacity={0.5} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="productName"
                            type="category"
                            width={120}
                            tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--text-muted)', textAnchor: 'start' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '1.5rem', border: '2px solid var(--input-border)', fontWeight: 900, fontSize: '12px' }}
                            cursor={{ fill: 'var(--primary)', fillOpacity: 0.05 }}
                        />
                        <Bar dataKey="totalMovements" fill="var(--primary)" name="Velocity Index" radius={[0, 15, 15, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StockTurnoverChart;
