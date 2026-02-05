'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Trash2, ClipboardList, User, Mail, SearchCheck, MapPin } from 'lucide-react';

interface PickTask {
    taskId: string;
    product: {
        productId: string;
        name: string;
        sku: string;
    };
    blockId: string;
    blockName: string;
    quantity: number;
    assignedTo: string;
    status: string;
    createdAt: number;
    completedAt?: number;
}

interface Order {
    orderId: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    status: string;
    totalItems: number;
    notes?: string;
    createdAt: number;
    pickedAt?: number;
    packedAt?: number;
    dispatchedAt?: number;
    pickTasks: PickTask[];
}

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        PENDING: 'bg-background text-muted border-card-border',
        PICK_ASSIGNED: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
        PICKED: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
        PACKED: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        DISPATCHED: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20'
    };
    return colors[status] || 'bg-background text-muted border-card-border';
};

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-500">
            <div className="bg-card rounded-[4rem] p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-card-border shadow-2xl animate-in zoom-in-95 scrollbar-hide">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-4xl font-black text-sharp tracking-tighter">Order Detail Matrix</h2>
                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-muted">Core telemetrics for entity #{order.orderNumber}</p>
                    </div>
                    <button onClick={onClose} className="p-4 bg-background rounded-2xl text-muted hover:text-sharp border border-card-border/50 transition-all shadow-sm">
                        <Trash2 size={24} className="rotate-45" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Entity Meta</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Reference Handle', value: order.orderNumber, icon: ClipboardList },
                                { label: 'Customer Alias', value: order.customerName, icon: User },
                                { label: 'System Mailbox', value: order.customerEmail, icon: Mail },
                                { label: 'Fulfillment Status', value: order.status, icon: SearchCheck },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-2xl border border-card-border/30">
                                    <item.icon size={18} className="text-primary/50" />
                                    <div>
                                        <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-sm font-black text-sharp">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Logistics Params</h3>
                        <div className="p-6 bg-background rounded-[2.5rem] border-2 border-card-border h-full">
                            <div className="flex items-start gap-4 mb-6">
                                <MapPin className="text-primary mt-1" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2">Delivery Coordinates</p>
                                    <p className="text-sm font-black text-sharp leading-relaxed">{order.shippingAddress}</p>
                                </div>
                            </div>
                            {order.notes && (
                                <div className="mt-8 p-4 bg-card rounded-2xl border border-card-border/50 italic text-muted text-sm">
                                    <span className="font-black text-[8px] uppercase block mb-1">Operational Notes:</span>
                                    "{order.notes}"
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Extraction Manifest (Pick Tasks)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {order.pickTasks?.map(task => (
                        <div key={task.taskId} className="bg-background p-6 rounded-3xl border-2 border-card-border/50 flex flex-col gap-4 group hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-lg font-black text-sharp group-hover:text-primary transition-colors">{task.product.name}</p>
                                    <p className="text-[9px] font-black text-muted uppercase tracking-widest mt-1">SKU: {task.product.sku}</p>
                                </div>
                                <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-background text-muted border-card-border'}`}>
                                    {task.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-card rounded-xl border border-card-border/30">
                                    <p className="text-[8px] font-black text-muted uppercase mb-1">Source Node</p>
                                    <p className="text-xs font-black text-sharp">{task.blockName}</p>
                                </div>
                                <div className="p-3 bg-card rounded-xl border border-card-border/30">
                                    <p className="text-[8px] font-black text-muted uppercase mb-1">Assigned Opt</p>
                                    <p className="text-xs font-black text-sharp">{task.assignedTo || 'PENDING_DEPLOY'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    onClick={onClose}
                    variant="ghost"
                    className="w-full py-5 text-xs font-black uppercase tracking-widest border-2 border-input-border rounded-[2rem] hover:bg-sharp hover:text-background transition-all"
                >
                    Return to Command
                </Button>
            </div>
        </div>
    );
}
