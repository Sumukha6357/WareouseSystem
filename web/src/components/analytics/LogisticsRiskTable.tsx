import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Radar } from 'lucide-react';
import type { ShipmentRiskResponse } from '@/types/api';

interface LogisticsRiskTableProps {
    data: ShipmentRiskResponse[];
}

const LogisticsRiskTable: React.FC<LogisticsRiskTableProps> = ({ data }) => {
    return (
        <Card className="shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-card-border/30">
                <CardTitle className="flex items-center gap-4 text-sharp italic">
                    <div className="p-3 bg-red-500/10 rounded-2xl text-red-600">
                        <Radar size={20} />
                    </div>
                    Logistics Risk Radar
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background/50 border-b border-card-border/30">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.3em]">Telemetry Vector</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.3em]">Threat Index</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-muted uppercase tracking-[0.3em]">Detection Alert</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border/20">
                            {data && data.length > 0 ? (
                                data.map((shipment) => (
                                    <tr key={shipment.shipmentId} className="hover:bg-red-500/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-primary hover:underline cursor-pointer tracking-tighter decoration-2 underline-offset-4">
                                                {shipment.trackingNumber || 'UNLINKED_UPLINK'}
                                            </div>
                                            <div className="text-[8px] text-muted font-bold uppercase tracking-widest mt-1">NODE: {shipment.shipmentId.slice(0, 8)}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge
                                                variant={shipment.riskLevel === 'CRITICAL' ? 'danger' : 'warning'}
                                                className={`h-8 px-4 text-[9px] font-black uppercase tracking-widest border-2 ${shipment.riskLevel === 'CRITICAL' ? 'animate-pulse' : ''}`}
                                            >
                                                {shipment.riskLevel} THREAT
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-[10px] font-black text-sharp uppercase tracking-tight leading-relaxed max-w-[200px] ml-auto">
                                                {shipment.detectedIssue}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.6em]">Zero-Risk Environment Detected</p>
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

export default LogisticsRiskTable;
