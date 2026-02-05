import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';

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
            <div className="flex items-center gap-2 mb-4">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black text-sharp uppercase tracking-widest">
                    Stored Units ({inventories.length})
                </span>
            </div>
            {inventories.length > 0 ? (
                <div className="space-y-3">
                    {inventories.map((inv) => (
                        <div
                            key={inv.inventoryId}
                            className={`p-4 rounded-2xl border-2 transition-all ${inv.isLowStock ? 'bg-amber-500/5 border-amber-500/20' : 'bg-background border-card-border/20'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-sharp truncate text-xs">
                                        {inv.product.name}
                                    </p>
                                    <p className="text-[9px] text-muted font-black uppercase tracking-widest mt-1">{inv.product.sku}</p>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="text-sm font-black text-primary tabular-nums">{inv.quantity}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-2 py-1.5 text-center">
                                    <p className="text-emerald-600 font-black text-[10px] tabular-nums">{inv.availableQuantity}</p>
                                    <p className="text-[8px] font-black text-emerald-500/80 uppercase">Free</p>
                                </div>
                                <div className="bg-primary/5 border border-primary/10 rounded-xl px-2 py-1.5 text-center">
                                    <p className="text-primary font-black text-[10px] tabular-nums">{inv.reservedQuantity || 0}</p>
                                    <p className="text-[8px] font-black text-primary/80 uppercase">Hold</p>
                                </div>
                                <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-2 py-1.5 text-center">
                                    <p className="text-red-600 font-black text-[10px] tabular-nums">{inv.damagedQuantity || 0}</p>
                                    <p className="text-[8px] font-black text-red-500/80 uppercase">Loss</p>
                                </div>
                            </div>

                            {inv.isLowStock && (
                                <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest mt-3 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" /> Critical Stock
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 bg-background rounded-3xl border border-dashed border-card-border/50">
                    <Package className="h-8 w-8 text-muted/20 mx-auto mb-2" />
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">Empty Node</p>
                </div>
            )}
        </div>
    );
};

export default InventoryDetails;
