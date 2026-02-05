import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ProcessAgingResponse } from '../../services/AnalyticsService';

interface BottleneckTableProps {
    data: ProcessAgingResponse[];
}

const BottleneckTable: React.FC<BottleneckTableProps> = ({ data }) => {
    return (
        <div className="bg-card p-10 rounded-[3.5rem] border-2 border-card-border shadow-sm">
            <h2 className="text-xl font-black text-sharp mb-8 uppercase tracking-widest flex items-center gap-4">
                <AlertTriangle className="text-red-600" size={28} />
                Operational Bottlenecks
            </h2>
            <div className="overflow-hidden rounded-[2rem] border-2 border-card-border">
                <table className="min-w-full divide-y-2 divide-card-border">
                    <thead className="bg-background">
                        <tr>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Order Ref</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Phase Status</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Latency Index</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y-2 divide-card-border/30">
                        {data && data.length > 0 ? (
                            data.map((order) => (
                                <tr key={order.orderId} className="hover:bg-background/50 transition-colors group">
                                    <td className="px-8 py-6 text-sm font-black text-sharp group-hover:text-primary transition-colors">#{order.orderNumber}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border-2 shadow-sm ${order.status === 'PENDING' ? 'bg-background border-card-border/50 text-muted' :
                                            order.status === 'PICKED' ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-700' :
                                                'bg-primary/5 border-primary/20 text-primary'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-red-600 font-black text-lg tracking-tighter">
                                            {order.hoursInState.toFixed(1)}H <span className="text-[10px] text-muted uppercase ml-1">STALL</span>
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-8 py-10 text-center text-xs font-black text-emerald-600 uppercase tracking-widest">Pipeline Operating at Peak Efficiency</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BottleneckTable;
