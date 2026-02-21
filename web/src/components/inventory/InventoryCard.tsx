'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Box, AlertTriangle, TrendingUp, Settings2, Trash2 } from 'lucide-react';

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

interface InventoryCardProps {
    inventory: Inventory;
    onAdjust: (inventory: Inventory) => void;
    onEdit: (inventory: Inventory) => void;
    onDelete: (inventoryId: string) => void;
}

export default function InventoryCard({ inventory, onAdjust, onEdit, onDelete }: InventoryCardProps) {
    return (
        <div
            className={`bg-card rounded-[3rem] p-10 border-2 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col ${inventory.isLowStock ? 'border-amber-500/30 bg-amber-500/[0.02]' : 'border-card-border'
                }`}
        >
            {inventory.isLowStock && (
                <div className="absolute top-8 right-8 p-2 bg-amber-500/10 rounded-xl text-amber-600 animate-bounce">
                    <AlertTriangle className="h-5 w-5" />
                </div>
            )}

            <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    <Box className="h-7 w-7" />
                </div>
            </div>

            <h4 className="text-2xl font-black text-sharp mb-2 truncate group-hover:text-primary transition-colors pr-8">
                {inventory.product.name}
            </h4>

            <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-[10px] font-black text-muted uppercase tracking-widest bg-background/50 px-3 py-1.5 rounded-xl border border-card-border/50">
                    SKU: {inventory.product.sku}
                </span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 font-mono">
                    📍 {inventory.blockName}
                </span>
            </div>

            <div className="space-y-6 flex-1">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em] pb-1">Current Load</span>
                    <span className="text-5xl font-black text-sharp tabular-nums leading-none tracking-tighter">{inventory.quantity}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/40 p-4 rounded-2xl border border-card-border/30">
                        <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-2">Available</p>
                        <p className="text-lg font-black text-emerald-600 tabular-nums">{inventory.availableQuantity}</p>
                    </div>
                    <div className="bg-background/40 p-4 rounded-2xl border border-card-border/30">
                        <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-2">Reserved</p>
                        <p className="text-lg font-black text-amber-600 tabular-nums">{inventory.reservedQuantity}</p>
                    </div>
                </div>

                {inventory.maxStockLevel > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted">
                            <span>Capacity Utilization</span>
                            <span>{Math.round((inventory.quantity / inventory.maxStockLevel) * 100)}%</span>
                        </div>
                        <div className="w-full bg-background/50 rounded-full h-2.5 overflow-hidden border border-card-border/30 p-[2px]">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${inventory.isLowStock ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]'
                                    }`}
                                style={{ width: `${Math.min((inventory.quantity / inventory.maxStockLevel) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-3 mt-10 pt-8 border-t border-card-border/30">
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 font-black text-[10px] uppercase tracking-widest rounded-2xl border-2 hover:bg-sharp hover:text-white transition-all transition-colors h-12"
                    onClick={() => onAdjust(inventory)}
                >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Reconcile
                </Button>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(inventory)}
                        className="h-12 w-12 flex items-center justify-center bg-background hover:bg-primary/10 rounded-2xl text-muted hover:text-primary transition-all border border-card-border/50 shadow-sm"
                        title="Edit Logic"
                    >
                        <Settings2 className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => onDelete(inventory.inventoryId)}
                        className="h-12 w-12 flex items-center justify-center bg-background hover:bg-red-500/10 rounded-2xl text-muted hover:text-red-500 transition-all border border-card-border/50 shadow-sm"
                        title="Abort Node"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
