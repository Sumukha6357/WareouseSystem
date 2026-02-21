import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface Inventory {
    inventoryId: string;
    product: {
        productId: string;
        name: string;
        sku: string;
    };
    blockId: string;
    quantity: number;
    reservedQuantity: number;
    damagedQuantity: number;
    availableQuantity: number;
    isLowStock: boolean;
}

interface InventoryDetailsProps {
    inventories: Inventory[];
}

const InventoryDetails: React.FC<InventoryDetailsProps> = ({ inventories }) => {
    return (
        <div className="border-t border-card-border/50 pt-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black text-sharp uppercase tracking-widest">
                        Stored Units
                    </span>
                </div>
                <Badge variant="outline" className="px-2 py-0.5">
                    {inventories.length} ENTITIES
                </Badge>
            </div>
            {inventories.length > 0 ? (
                <div className="space-y-4">
                    {inventories.map((inv) => (
                        <div
                            key={inv.inventoryId}
                            className={`p-5 rounded-2xl border-2 transition-all duration-300 ${inv.isLowStock
                                ? 'bg-amber-500/5 border-amber-500/30 shadow-lg shadow-amber-500/5'
                                : 'bg-background/50 border-card-border/40 hover:border-primary/20'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-sharp truncate text-sm italic">
                                        {inv.product.name}
                                    </p>
                                    <p className="text-[10px] text-muted font-black uppercase tracking-widest mt-1 font-mono">{inv.product.sku}</p>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="text-lg font-black text-primary tabular-nums leading-none">{inv.quantity}</p>
                                    <p className="text-[8px] font-black text-muted uppercase tracking-widest mt-1">Total</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-2 py-2 text-center">
                                    <p className="text-emerald-600 font-black text-xs tabular-nums">{inv.availableQuantity}</p>
                                    <p className="text-[8px] font-black text-emerald-500/60 uppercase tracking-tighter">Available</p>
                                </div>
                                <div className="bg-primary/5 border border-primary/10 rounded-xl px-2 py-2 text-center">
                                    <p className="text-primary font-black text-xs tabular-nums">{inv.reservedQuantity || 0}</p>
                                    <p className="text-[8px] font-black text-primary/60 uppercase tracking-tighter">Reserved</p>
                                </div>
                                <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-2 py-2 text-center">
                                    <p className="text-red-600 font-black text-xs tabular-nums">{inv.damagedQuantity || 0}</p>
                                    <p className="text-[8px] font-black text-red-500/60 uppercase tracking-tighter">Damaged</p>
                                </div>
                            </div>

                            {inv.isLowStock && (
                                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg w-fit">
                                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                                    <span className="text-[9px] text-amber-700 font-black uppercase tracking-widest">Low Stock Alert</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-background/30 rounded-[2rem] border-2 border-dashed border-card-border/50">
                    <Package className="h-10 w-10 text-muted/10 mx-auto mb-3" />
                    <p className="text-[10px] font-black text-muted/40 uppercase tracking-[0.3em]">Empty Node Cluster</p>
                </div>
            )}
        </div>
    );
};

export default InventoryDetails;
