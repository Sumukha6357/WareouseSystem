import { BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import type { StockTurnoverResponse } from '@/types/api';

interface StockTurnoverChartProps {
    data: StockTurnoverResponse[];
}

const StockTurnoverChart: React.FC<StockTurnoverChartProps> = ({ data }) => {
    return (
        <Card className="shadow-sm overflow-visible">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-4 text-sharp italic">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <BarChartIcon size={20} />
                    </div>
                    Stock Velocity Matrix
                </CardTitle>
            </CardHeader>
            <CardContent className="h-80 pt-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="0" horizontal={false} vertical={true} stroke="var(--card-border)" strokeOpacity={0.3} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="productName"
                            type="category"
                            width={110}
                            tick={{ fontSize: 9, fontWeight: 900, fill: 'var(--text-muted)', textAnchor: 'start' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '1.5rem', border: '2px solid var(--card-border)', fontWeight: 900, fontSize: '11px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                            cursor={{ fill: 'var(--primary)', fillOpacity: 0.05 }}
                        />
                        <Bar dataKey="totalMovements" fill="var(--primary)" name="Velocity Index" radius={[0, 12, 12, 0]} barSize={24} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default StockTurnoverChart;
