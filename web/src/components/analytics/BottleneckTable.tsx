import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { ProcessAgingResponse } from '@/types/api';

interface BottleneckTableProps {
    data: ProcessAgingResponse[];
}

const BottleneckTable: React.FC<BottleneckTableProps> = ({ data }) => {
    return (
        <Card className="shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-card-border/30">
                <CardTitle className="flex items-center gap-4 text-sharp italic">
                    <div className="p-3 bg-red-500/10 rounded-2xl text-red-600">
                        <AlertTriangle size={20} />
                    </div>
                    Operational Impedance
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background/50 border-b border-card-border/30">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.3em]">Transaction Ref</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.3em]">State Phase</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-muted uppercase tracking-[0.3em]">Latency Delta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border/20">
                            {data && data.length > 0 ? (
                                data.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-background/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-sharp group-hover:text-primary transition-colors">#{order.orderNumber}</div>
                                            <div className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">ID: {order.orderId.slice(0, 8)}...</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge
                                                variant={order.status === 'PENDING' ? 'secondary' : order.status === 'PICKED' ? 'primary' : 'success'}
                                                className="h-8 px-4 text-[9px] font-black uppercase tracking-widest border-2"
                                            >
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-red-600 font-extrabold text-lg tracking-tighter leading-none">
                                                    {order.hoursInState.toFixed(1)}H
                                                </span>
                                                <span className="text-[8px] text-muted font-black uppercase tracking-widest mt-1">STALL INDEX</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16 text-center">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em]">Pipeline Peak Efficiency</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default BottleneckTable;
