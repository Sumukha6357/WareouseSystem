'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

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

interface StockAdjustmentModalProps {
    inventory: Inventory;
    adjustmentAmount: number;
    onAdjustmentChange: (amount: number) => void;
    onAdjust: () => void;
    onClose: () => void;
    isLoading?: boolean;
}

export default function StockAdjustmentModal({
    inventory,
    adjustmentAmount,
    onAdjustmentChange,
    onAdjust,
    onClose,
    isLoading = false
}: StockAdjustmentModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
            <div className="bg-card rounded-[4rem] p-12 max-w-lg w-full border-2 border-card-border shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h3 className="text-3xl font-black text-sharp tracking-tighter">Recalibrate Stock</h3>
                        <p className="text-sm font-medium text-muted mt-1 leading-tight">
                            Modifying <span className="text-primary">{inventory.product.name}</span> <br />
                            Node: <span className="font-mono text-xs">{inventory.blockName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-4 hover:bg-background rounded-3xl text-muted hover:text-sharp transition-all border border-transparent hover:border-card-border/50"
                    >
                        <X size={28} />
                    </button>
                </div>

                <div className="space-y-10">
                    <div className="text-center py-10 px-8 bg-background rounded-[2.5rem] border-2 border-card-border/50 shadow-inner">
                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-4">Live Balance</p>
                        <p className="text-7xl font-black text-sharp tabular-nums tracking-tighter">{inventory.quantity}</p>
                        <div className="flex justify-center gap-4 mt-6">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                Avail: {inventory.availableQuantity}
                            </span>
                            {inventory.reservedQuantity > 0 && (
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                                    Hold: {inventory.reservedQuantity}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-4 ml-2">Variance Magnitude</label>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full rounded-[2rem] border-4 border-input-border bg-background py-6 px-8 focus:ring-8 focus:ring-primary/10 transition-all font-black text-center text-5xl text-sharp outline-none shadow-xl"
                                placeholder="0"
                                value={adjustmentAmount}
                                onChange={(e) => onAdjustmentChange(parseInt(e.target.value) || 0)}
                                autoFocus
                            />
                            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                                <span className="text-3xl font-black text-muted/30">{adjustmentAmount >= 0 ? '+' : ''}</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-muted mt-4 text-center font-bold uppercase tracking-widest opacity-60">
                            Positive to add inventory, Negative to deduct
                        </p>
                    </div>

                    {adjustmentAmount !== 0 && (
                        <div className="p-6 bg-primary/5 rounded-[2rem] border-2 border-primary/20 text-center animate-in fade-in zoom-in-95 duration-500">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Projected Node Equilibrium</p>
                            <p className="text-3xl font-black text-primary tracking-tight tabular-nums">
                                {inventory.quantity + adjustmentAmount} UNITS
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-4 pt-4">
                        <Button
                            onClick={onAdjust}
                            className="w-full py-7 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/30 h-18"
                            isLoading={isLoading}
                            disabled={adjustmentAmount === 0}
                        >
                            {adjustmentAmount > 0 ? <TrendingUp className="h-6 w-6 mr-3" /> : <TrendingDown className="h-6 w-6 mr-3" />}
                            Commence Recalibration
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full py-5 text-[10px] font-black uppercase tracking-widest"
                            onClick={onClose}
                        >
                            Abort Cycle
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
