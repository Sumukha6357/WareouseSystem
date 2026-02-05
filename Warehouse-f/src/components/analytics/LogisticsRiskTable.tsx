import React from 'react';
import { ShipmentRiskResponse } from '../../services/AnalyticsService';

interface LogisticsRiskTableProps {
    data: ShipmentRiskResponse[];
}

const LogisticsRiskTable: React.FC<LogisticsRiskTableProps> = ({ data }) => {
    return (
        <div className="bg-card p-10 rounded-[3.5rem] border-2 border-card-border shadow-sm">
            <h2 className="text-2xl font-black text-sharp mb-10 uppercase tracking-widest flex items-center gap-4">
                <span className="text-3xl">📡</span>
                Real-time Logistics Risk Radar
            </h2>
            <div className="overflow-hidden rounded-[2.5rem] border-2 border-card-border">
                <table className="min-w-full divide-y-2 divide-card-border">
                    <thead className="bg-background">
                        <tr>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Telemetry Ref</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Threat Level</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Detected Anomaly</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y-2 divide-card-border/30">
                        {data && data.length > 0 ? (
                            data.map((shipment) => (
                                <tr key={shipment.shipmentId} className="hover:bg-red-500/5 transition-colors group">
                                    <td className="px-8 py-6 text-sm font-black text-primary hover:underline cursor-pointer">{shipment.trackingNumber || 'UNLINKED TELEMETRY'}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${shipment.riskLevel === 'CRITICAL' ? 'bg-red-500/10 text-red-700 border-red-500/20 animate-pulse' :
                                            'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                            }`}>
                                            {shipment.riskLevel} THREAT
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-muted uppercase tracking-tight">{shipment.detectedIssue}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-8 py-20 text-center text-xs font-black text-emerald-600 uppercase tracking-[0.4em] bg-emerald-500/[0.02]">
                                    Logistics Zero-Risk Environment
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogisticsRiskTable;
