'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import {
    Trash2,
    ClipboardList,
    User,
    Mail,
    SearchCheck,
    MapPin,
    Package,
    Navigation,
    Clock,
    UserCheck,
    Box
} from 'lucide-react';

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

const getStatusVariant = (status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' => {
    switch (status) {
        case 'PENDING': return 'outline';
        case 'PICK_ASSIGNED': return 'secondary';
        case 'PICKED': return 'primary';
        case 'PACKED': return 'warning';
        case 'DISPATCHED': return 'success';
        case 'CANCELLED': return 'danger';
        default: return 'outline';
    }
};

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Order Detail Matrix"
            maxWidth="4xl"
        >
            <div className="space-y-12 animate-in fade-in duration-700">
                <div className="flex justify-between items-center -mt-6">
                    <p className="text-sm font-medium text-muted italic uppercase tracking-tight">
                        Core telemetrics for entity <span className="text-sharp font-black">#{order.orderNumber}</span>
                    </p>
                    <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2 italic">
                                <User size={14} /> Entity Specification
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: 'Customer Alias', value: order.customerName, icon: User },
                                    { label: 'System Mailbox', value: order.customerEmail, icon: Mail },
                                    { label: 'Total units', value: `${order.totalItems} Items`, icon: Package },
                                    { label: 'Initiation Vector', value: new Date(order.createdAt).toLocaleDateString(), icon: Clock },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-5 p-5 bg-background/50 rounded-3xl border border-card-border/40 group hover:border-primary/20 transition-all">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                                            <item.icon size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="text-sm font-black text-sharp truncate italic uppercase tracking-tight">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2 italic">
                                <MapPin size={14} /> Logistics Parameters
                            </h3>
                            <Card className="bg-background/30 border-card-border/50 shadow-none">
                                <CardContent className="p-8 space-y-8">
                                    <div className="flex items-start gap-6">
                                        <div className="p-4 bg-primary/10 rounded-[1.5rem] text-primary shrink-0">
                                            <Navigation size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-2 leading-none">Fulfillment Terminal Coordinates</p>
                                            <p className="text-base font-black text-sharp leading-relaxed italic tracking-tight">{order.shippingAddress}</p>
                                        </div>
                                    </div>
                                    {order.notes && (
                                        <div className="p-6 bg-card rounded-[2rem] border-2 border-card-border/30 italic text-muted text-sm relative overflow-hidden group/note">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-primary/30 group-hover/note:bg-primary transition-colors" />
                                            <span className="font-black text-[9px] uppercase block mb-2 tracking-widest leading-none">Operational Directives:</span>
                                            &quot;{order.notes}&quot;
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2 italic">
                            <ClipboardList size={14} /> Extraction Manifest
                        </h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                            {order.pickTasks?.map(task => (
                                <div key={task.taskId} className="bg-background/60 p-6 rounded-[2.5rem] border-2 border-card-border/40 flex flex-col gap-6 group hover:border-primary/40 transition-all hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="min-w-0">
                                            <p className="text-base font-black text-sharp group-hover:text-primary transition-colors italic uppercase tracking-tight truncate">{task.product.name}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-[8px] h-6 px-3">
                                                    SKU: {task.product.sku}
                                                </Badge>
                                                <Badge variant="secondary" className="text-[8px] h-6 px-3">
                                                    QTY: {task.quantity}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="p-4 bg-card/50 rounded-2xl border border-card-border/30 flex items-center gap-3 group/source">
                                            <Box size={14} className="text-muted group-hover/source:text-primary transition-colors" />
                                            <div>
                                                <p className="text-[8px] font-black text-muted uppercase mb-1 leading-none tracking-widest">Node</p>
                                                <p className="text-xs font-black text-sharp italic uppercase tracking-tight">{task.blockName}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-card/50 rounded-2xl border border-card-border/30 flex items-center gap-3 group/assignee">
                                            <UserCheck size={14} className="text-muted group-hover/assignee:text-primary transition-colors" />
                                            <div>
                                                <p className="text-[8px] font-black text-muted uppercase mb-1 leading-none tracking-widest">Assignee</p>
                                                <p className="text-xs font-black text-sharp italic uppercase tracking-tight">{task.assignedTo || 'PENDING'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={task.status === 'COMPLETED' ? 'success' : 'outline'}
                                        className="w-full justify-center h-8"
                                    >
                                        {task.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-card-border/30">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        className="w-full py-7 shadow-2xl shadow-sharp/10"
                    >
                        Return to Command Center
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
