'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { FormField } from '@/components/ui/FormField';
import { Plus, Trash2 } from 'lucide-react';

interface OrderItem {
    productId: string;
    quantity: number;
}

interface Product {
    productId: string;
    name: string;
    sku: string;
}

interface OrderFormProps {
    products: Product[];
    onSubmit: (order: OrderFormData) => void;
    onClose: () => void;
    isLoading?: boolean;
}

export interface OrderFormData {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    notes?: string;
    items: OrderItem[];
}

export default function OrderForm({
    products,
    onSubmit,
    onClose,
    isLoading = false
}: OrderFormProps) {
    const [formData, setFormData] = useState<OrderFormData>({
        orderNumber: '',
        customerName: '',
        customerEmail: '',
        shippingAddress: '',
        notes: '',
        items: [{ productId: '', quantity: 1 }]
    });

    const addOrderItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { productId: '', quantity: 1 }]
        });
    };

    const removeOrderItem = (index: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index)
        });
    };

    const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
        const updatedItems = [...formData.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value } as OrderItem;
        setFormData({ ...formData, items: updatedItems });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleClose = () => {
        setFormData({
            orderNumber: '',
            customerName: '',
            customerEmail: '',
            shippingAddress: '',
            notes: '',
            items: [{ productId: '', quantity: 1 }]
        });
        onClose();
    };

    return (
        <Modal
            isOpen={true}
            onClose={handleClose}
            title="New Transaction"
            maxWidth="4xl"
        >
            <div className="space-y-12 animate-in fade-in duration-700">
                <p className="text-sm font-medium text-muted -mt-8 italic tracking-tight">Populating extraction manifest for node synchronization.</p>

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            label="Transaction Reference"
                            value={formData.orderNumber}
                            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                            placeholder="ORD-XXXX-MATRIX"
                            required
                        />
                        <FormField
                            label="Entity Identifier (Customer)"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            placeholder="FULL_NAME_ALLOCATION"
                            required
                        />
                        <FormField
                            label="Communication Link (Mail)"
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                            placeholder="TRANSCEIVER@NODE.SYS"
                            required
                        />
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-3 ml-1">Fulfillment Priority</label>
                            <div className="flex gap-2">
                                <Badge variant="primary" className="h-10 px-6 cursor-pointer opacity-50 hover:opacity-100 transition-opacity">Standard</Badge>
                                <Badge variant="secondary" className="h-10 px-6 cursor-pointer">Protocol_High</Badge>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-3 ml-1">Target Coordinates (Shipping)</label>
                            <textarea
                                value={formData.shippingAddress}
                                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                                className="w-full rounded-[2rem] border-2 border-input-border bg-background py-6 px-8 text-sm font-black text-sharp outline-none focus:ring-8 focus:ring-primary/10 transition-all min-h-[140px] shadow-sm italic placeholder:opacity-30"
                                placeholder="VECTOR_TARGET_ADDRESS_BLOCK"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic flex items-center gap-3">
                                <div className="h-[2px] w-6 bg-primary/30" /> Payload Configuration
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addOrderItem}
                                className="h-10 px-5 rounded-xl border-primary/20 hover:border-primary/50 text-[9px] shadow-lg shadow-primary/5"
                            >
                                <Plus size={14} className="mr-2" /> Add Payload Segment
                            </Button>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                            {formData.items.map((item, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-4 p-8 bg-background/50 rounded-[2.5rem] border-2 border-card-border/40 relative group hover:border-primary/20 transition-all hover:bg-background/80">
                                    <div className="flex-1">
                                        <label className="block text-[8px] font-black text-muted uppercase tracking-[0.4em] mb-3 ml-2">Node Specification</label>
                                        <select
                                            value={item.productId}
                                            onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
                                            className="w-full px-6 py-4 bg-card border-2 border-input-border/30 rounded-2xl text-sharp font-black uppercase tracking-widest text-xs focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none hover:border-primary/20"
                                        >
                                            <option value="">-- RESOLVE_PRODUCT_HANDLE --</option>
                                            {products.map(product => (
                                                <option key={product.productId} value={product.productId}>
                                                    {product.name} ({product.sku})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full md:w-40">
                                        <label className="block text-[8px] font-black text-muted uppercase tracking-[0.4em] mb-3 ml-2">Density (Qty)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                                            className="w-full px-6 py-4 bg-card border-2 border-input-border/30 rounded-2xl text-sharp font-black text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none hover:border-primary/20 tabular-nums"
                                        />
                                    </div>
                                    {formData.items.length > 1 && (
                                        <div className="md:mt-10 flex items-center">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeOrderItem(index)}
                                                className="h-14 w-14 bg-red-500/5 text-red-600 rounded-2xl border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5 mt-auto"
                                            >
                                                <Trash2 size={20} />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-card-border/30">
                        <Button
                            type="submit"
                            className="flex-[2] py-8 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 h-20"
                            isLoading={isLoading}
                        >
                            Commit to Logistics Matrix
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest"
                        >
                            Abort Initialization
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
