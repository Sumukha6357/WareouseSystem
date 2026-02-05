'use client';

import React from 'react';
import InventoryCard from './InventoryCard';
import { Button } from '@/components/ui/Button';
import { Package, Search, AlertTriangle } from 'lucide-react';

interface Inventory {
    inventoryId: string;
    product: {
        productId: string;
        name: string;
        sku: string;
    };
    blockId: string;
    blockName: string;
    quantity: number;
    reservedQuantity: number;
    availableQuantity: number;
    minStockLevel: number;
    maxStockLevel: number;
    isLowStock: boolean;
}

interface InventoryListProps {
    inventories: Inventory[];
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onAdjust: (inventory: Inventory) => void;
    onEdit: (inventory: Inventory) => void;
    onDelete: (inventoryId: string) => void;
    onCreateClick: () => void;
}

export default function InventoryList({
    inventories,
    searchTerm,
    onSearchChange,
    onAdjust,
    onEdit,
    onDelete,
    onCreateClick
}: InventoryListProps) {
    const filteredInventories = inventories.filter(inv =>
        inv.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.blockName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockCount = inventories.filter(inv => inv.isLowStock).length;

    return (
        <>
            {lowStockCount > 0 && (
                <div className="bg-amber-500/5 border-2 border-amber-500/20 rounded-[2.5rem] p-8 flex items-center gap-6 animate-pulse shadow-lg shadow-amber-500/5">
                    <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-600 border border-amber-500/20">
                        <AlertTriangle className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-amber-900 uppercase tracking-[0.2em]">Low Stock Condition Detected</p>
                        <p className="text-base font-black text-amber-700/80 mt-1">{lowStockCount} resource clusters require immediate replenishment</p>
                    </div>
                </div>
            )}

            <div className="relative group max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Scan by product name, SKU, or storage node..."
                    className="w-full pl-16 pr-8 py-5 bg-card border-2 border-input-border rounded-[2rem] text-sm font-black uppercase tracking-widest text-sharp focus:ring-4 focus:ring-primary/10 transition-all shadow-sm outline-none"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredInventories.map((inventory) => (
                    <InventoryCard
                        key={inventory.inventoryId}
                        inventory={inventory}
                        onAdjust={onAdjust}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}

                {filteredInventories.length === 0 && (
                    <div className="col-span-full py-40 border-4 border-dashed border-card-border rounded-[4rem] text-center bg-card/30">
                        <Package className="h-24 w-24 text-muted/10 mx-auto mb-8" />
                        <p className="text-muted font-black uppercase tracking-[0.5em] text-sm">No Grid Data Detected</p>
                        <p className="text-[10px] text-muted/40 mt-6 font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                            Initialize resource allocation protocols to populate the control interface
                        </p>
                        <Button
                            variant="ghost"
                            className="mt-10 text-[10px] font-black uppercase tracking-widest"
                            onClick={onCreateClick}
                        >
                            Execute Primary Allocation
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
