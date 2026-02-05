'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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

    const updateOrderItem = (index: number, field: string, value: any) => {
        const updatedItems = [...formData.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setFormData({ ...formData, items: updatedItems });
    };

    const handleSubmit = () => {
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
            <div className="bg-card rounded-[4rem] p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-card-border shadow-2xl animate-in zoom-in-95 scrollbar-hide">
                <div className="flex justify-between items-center mb-10 sticky top-0 bg-card z-10 pb-4 border-b-2 border-card-border/50">
                    <div>
                        <h2 className="text-4xl font-black text-sharp tracking-tighter">New Transaction</h2>
                        <p className="text-sm font-medium text-muted mt-1">Populating order extraction manifest</p>
                    </div>
                    <Button variant="ghost" onClick={handleClose} className="h-12 w-12 rounded-xl border border-card-border shadow-sm p-0">
                        <Trash2 className="rotate-45" size={24} />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <Input
                        label="Order ID"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        placeholder="ORD-XXXX"
                        required
                    />
                    <Input
                        label="Customer Entity"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        placeholder="FULL_NAME"
                        required
                    />
                    <Input
                        label="Contact Mailbox"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        placeholder="MAIL@DOMAIN.COM"
                        required
                    />
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-3 ml-1">Logistics Drop Point</label>
                        <textarea
                            value={formData.shippingAddress}
                            onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                            className="w-full rounded-2xl border-2 border-input-border bg-background py-4 px-6 text-sm font-black text-sharp outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[100px]"
                            placeholder="PHYSICAL_ADDRESS_PROTOCOL"
                            required
                        />
                    </div>
                </div>

                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Payload Configuration</h3>
                        <button
                            onClick={addOrderItem}
                            className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-xl border border-primary/20 hover:bg-primary/10 transition-all"
                        >
                            <Plus size={14} /> Add Segment
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.items.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-6 bg-background rounded-3xl border-2 border-card-border/50 relative group">
                                <div className="flex-1">
                                    <label className="block text-[8px] font-black text-muted uppercase tracking-widest mb-2 ml-1">Component Node</label>
                                    <select
                                        value={item.productId}
                                        onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
                                        className="w-full px-4 py-3 bg-card border border-input-border rounded-xl text-sharp font-black uppercase tracking-widest text-xs focus:ring-2 focus:ring-primary transition-all outline-none"
                                    >
                                        <option value="">-- SELECT_PRODUCT --</option>
                                        {products.map(product => (
                                            <option key={product.productId} value={product.productId}>
                                                {product.name} ({product.sku})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full md:w-32">
                                    <label className="block text-[8px] font-black text-muted uppercase tracking-widest mb-2 ml-1">Density</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-card border border-input-border rounded-xl text-sharp font-black text-xs focus:ring-2 focus:ring-primary transition-all outline-none"
                                    />
                                </div>
                                {formData.items.length > 1 && (
                                    <button
                                        onClick={() => removeOrderItem(index)}
                                        className="md:mt-6 p-3 bg-red-500/10 text-red-600 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-sm self-end md:self-auto"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 sticky bottom-0 bg-card pt-6 border-t-2 border-card-border/50">
                    <Button
                        onClick={handleSubmit}
                        className="flex-1 py-6 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/20"
                        isLoading={isLoading}
                    >
                        Authenticate & Create
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest"
                    >
                        Abandon Build
                    </Button>
                </div>
            </div>
        </div>
    );
}
