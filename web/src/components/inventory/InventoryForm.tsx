'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';

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
        <Modal
            isOpen={true}
            onClose={onClose}
            title={editingInventory ? 'Node Transformation' : 'Allocation Protocol'}
            maxWidth="2xl"
        >
            <div className="space-y-12">
                <p className="text-sm font-medium text-muted -mt-6">
                    {editingInventory ? 'Adjusting resource distribution parameters' : 'Establishing new product-to-node link'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="md:col-span-2">
                            <label htmlFor="product-select" className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-4 ml-2">Product Resource</label>
                            <select
                                id="product-select"
                                required
                                className="w-full rounded-[2rem] border-2 border-input-border bg-background py-5 px-8 focus:ring-8 focus:ring-primary/10 transition-all font-black text-sharp outline-none appearance-none cursor-pointer shadow-sm"
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
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="block-select" className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-4 ml-2">Storage Node Terminal</label>
                            <select
                                id="block-select"
                                required
                                className="w-full rounded-[2rem] border-2 border-input-border bg-background py-5 px-8 focus:ring-8 focus:ring-primary/10 transition-all font-black text-sharp outline-none appearance-none cursor-pointer shadow-sm"
                                value={formData.blockId}
                                onChange={(e) => setFormData({ ...formData, blockId: e.target.value })}
                                disabled={!!editingInventory}
                            >
                                <option value="">Choose cluster node...</option>
                                {blocks.map(b => (
                                    <option key={b.blockId} value={b.blockId}>
                                        {b.room?.name || 'CENTRAL'} | Terminal {b.blockId.substring(0, 8).toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <FormField
                                label="Initial Payload"
                                type="number"
                                required
                                min="0"
                                placeholder="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div>
                            <FormField
                                label="Safety Threshold (Min)"
                                type="number"
                                min="0"
                                placeholder="Buffer"
                                value={formData.minStockLevel}
                                onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <FormField
                                label="Operational Limit (Max)"
                                type="number"
                                min="0"
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
        </Modal>
    );
}
