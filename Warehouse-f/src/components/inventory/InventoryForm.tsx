'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X } from 'lucide-react';

interface Product {
    productId: string;
    name: string;
    sku: string;
}

interface Block {
    blockId: string;
    room?: {
        roomId: string;
        name: string;
    };
}

interface Inventory {
    inventoryId: string;
    product: {
        productId: string;
        name: string;
        sku: string;
    };
    blockId: string;
    quantity: number;
    minStockLevel: number;
    maxStockLevel: number;
}

interface InventoryFormProps {
    products: Product[];
    blocks: Block[];
    editingInventory?: Inventory | null;
    onSubmit: (data: InventoryFormData) => void;
    onClose: () => void;
    isLoading?: boolean;
}

export interface InventoryFormData {
    productId: string;
    blockId: string;
    quantity: number;
    minStockLevel: number;
    maxStockLevel: number;
}

export default function InventoryForm({
    products,
    blocks,
    editingInventory,
    onSubmit,
    onClose,
    isLoading = false
}: InventoryFormProps) {
    const [formData, setFormData] = useState<InventoryFormData>({
        productId: editingInventory?.product.productId || '',
        blockId: editingInventory?.blockId || '',
        quantity: editingInventory?.quantity || 0,
        minStockLevel: editingInventory?.minStockLevel || 0,
        maxStockLevel: editingInventory?.maxStockLevel || 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-500">
            <div className="bg-card rounded-[4rem] p-12 max-w-2xl w-full border-2 border-card-border shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-start mb-12 sticky top-0 bg-card z-10 pb-4 border-b border-card-border/30">
                    <div>
                        <h3 className="text-4xl font-black text-sharp tracking-tighter">
                            {editingInventory ? 'Node Transformation' : 'Allocation Protocol'}
                        </h3>
                        <p className="text-sm font-medium text-muted mt-2">
                            {editingInventory ? 'Adjusting resource distribution parameters' : 'Establishing new product-to-node link'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-4 bg-background rounded-3xl text-muted hover:text-sharp transition-all border border-card-border/50 shadow-sm"
                    >
                        <X size={28} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-4 ml-2">Product Resource</label>
                            <div className="relative">
                                <select
                                    required
                                    className="w-full rounded-[2rem] border-2 border-input-border bg-background py-5 px-8 focus:ring-8 focus:ring-primary/10 transition-all font-black text-sharp outline-none appearance-none cursor-pointer"
                                    value={formData.productId}
                                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                    disabled={!!editingInventory}
                                >
                                    <option value="">Designate target profile...</option>
                                    {products.map(p => (
                                        <option key={p.productId} value={p.productId}>
                                            {p.name} — {p.sku}
                                        </option>
                                    ))}
                                </select>
                                {!editingInventory && <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-muted">▼</div>}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-4 ml-2">Storage Node Terminal</label>
                            <div className="relative">
                                <select
                                    required
                                    className="w-full rounded-[2rem] border-2 border-input-border bg-background py-5 px-8 focus:ring-8 focus:ring-primary/10 transition-all font-black text-sharp outline-none appearance-none cursor-pointer"
                                    value={formData.blockId}
                                    onChange={(e) => setFormData({ ...formData, blockId: e.target.value })}
                                    disabled={!!editingInventory}
                                >
                                    <option value="">Choose cluster node...</option>
                                    {blocks.map(b => (
                                        <option key={b.blockId} value={b.blockId}>
                                            {b.room?.name || 'CENTRAL'} // Terminal {b.blockId.substring(0, 8).toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                {!editingInventory && <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-muted">▼</div>}
                            </div>
                        </div>

                        <div>
                            <Input
                                label="Initial Payload"
                                type="number"
                                required
                                min="0"
                                className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                placeholder="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div>
                            <Input
                                label="Safety Threshold (Min)"
                                type="number"
                                min="0"
                                className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                placeholder="Buffer"
                                value={formData.minStockLevel}
                                onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Input
                                label="Operational Limit (Max)"
                                type="number"
                                min="0"
                                className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                placeholder="Max Capacity"
                                value={formData.maxStockLevel}
                                onChange={(e) => setFormData({ ...formData, maxStockLevel: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-card-border/30">
                        <Button
                            type="submit"
                            className="flex-1 py-7 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/30 h-18"
                            isLoading={isLoading}
                        >
                            {editingInventory ? 'Finalize Logic Update' : 'Initialize Node Link'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest"
                            onClick={onClose}
                        >
                            Abort Operation
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
