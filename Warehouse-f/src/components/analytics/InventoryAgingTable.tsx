import React from 'react';
import { Clock } from 'lucide-react';
import { InventoryAgingResponse } from '../../services/AnalyticsService';

interface InventoryAgingTableProps {
    data: InventoryAgingResponse[];
}

const InventoryAgingTable: React.FC<InventoryAgingTableProps> = ({ data }) => {
    return (
        <div className="bg-card p-10 rounded-[3.5rem] border-2 border-card-border shadow-sm">
            <h2 className="text-xl font-black text-sharp mb-8 uppercase tracking-widest flex items-center gap-4">
                <Clock className="text-amber-600" size={28} />
                Stagnant Inventory Audit
            </h2>
            <div className="overflow-hidden rounded-[2rem] border-2 border-card-border">
                <table className="min-w-full divide-y-2 divide-card-border">
                    <thead className="bg-background">
                        <tr>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Product Node</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Deployment</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Warehouse Age</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y-2 divide-card-border/30">
                        {data && data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.inventoryId} className="hover:bg-background/50 transition-colors group">
                                    <td className="px-8 py-6 text-sm font-black text-sharp group-hover:text-primary transition-colors">{item.productName}</td>
                                    <td className="px-8 py-6 text-[10px] font-black text-muted uppercase tracking-widest">{item.blockName}</td>
                                    <td className="px-8 py-6">
                                        <span className="bg-amber-500/10 text-amber-700 px-4 py-2 rounded-xl border border-amber-500/20 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                            {item.daysInWarehouse} CYCLES
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-8 py-10 text-center text-xs font-black text-muted uppercase tracking-widest">Active Stock Circulation Optimized</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryAgingTable;
