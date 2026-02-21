import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { InventoryAgingResponse } from '@/types/api';

interface InventoryAgingTableProps {
    data: InventoryAgingResponse[];
}

const InventoryAgingTable: React.FC<InventoryAgingTableProps> = ({ data }) => {
    return (
        <Card className="shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-card-border/30">
                <CardTitle className="flex items-center gap-4 text-sharp italic">
                    <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600">
                        <Clock size={20} />
                    </div>
                    Stagnant Extraction Matrix
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background/50 border-b border-card-border/30">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.3em]">Identity Hub</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.3em]">Vector</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-muted uppercase tracking-[0.3em]">Retention Delay</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border/20">
                            {data && data.length > 0 ? (
                                data.map((item) => (
                                    <tr key={item.inventoryId} className="hover:bg-background/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-sharp group-hover:text-primary transition-colors">{item.productName}</div>
                                            <div className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">ID: {item.inventoryId.slice(0, 8)}...</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant="secondary" className="bg-background border-card-border/50 text-[9px] font-black uppercase tracking-widest">
                                                {item.blockName}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Badge variant="warning" className="h-8 px-4 flex items-center justify-center gap-2 border-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                                                {item.daysInWarehouse} CYCLES
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16 text-center">
                                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">Circulation Optimized</p>
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

export default InventoryAgingTable;
