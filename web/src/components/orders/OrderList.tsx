'use client';

import React from 'react';
import { ShoppingBag, ChevronRight, MoreHorizontal, User, Package, CheckCircle2, Truck, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import RequireRole from '../auth/RequireRole';
import { cn } from '@/lib/utils';

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

interface OrderListProps {
    orders: Order[];
    filterStatus: string;
    onFilterChange: (status: string) => void;
    onAssignPicker: (orderId: string) => void;
    onUpdateStatus: (orderId: string, action: string) => void;
    onDispatch: (orderId: string) => void;
    onCancel: (orderId: string) => void;
    onViewDetails: (order: Order) => void;
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

export default function OrderList({
    orders,
    filterStatus,
    onFilterChange,
    onAssignPicker,
    onUpdateStatus,
    onDispatch,
    onCancel,
    onViewDetails
}: OrderListProps) {
    const filteredOrders = filterStatus === 'ALL'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    return (
        <div className="space-y-8">
            {/* Status Filter */}
            <div className="flex flex-wrap gap-3 p-2 bg-card rounded-[2rem] border-2 border-card-border w-fit shadow-sm">
                {['ALL', 'PENDING', 'PICK_ASSIGNED', 'PICKED', 'PACKED', 'DISPATCHED', 'CANCELLED'].map(status => (
                    <Button
                        key={status}
                        variant={filterStatus === status ? 'primary' : 'ghost'}
                        onClick={() => onFilterChange(status)}
                        className={cn(
                            "px-6 py-3 rounded-2xl text-[10px]",
                            filterStatus === status && "shadow-lg shadow-primary/20"
                        )}
                        aria-pressed={filterStatus === status}
                    >
                        {status.replace('_', ' ')}
                    </Button>
                ))}
            </div>

            {/* Orders Table */}
            {filteredOrders.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Protocol ID</TableHead>
                            <TableHead>Target Entity</TableHead>
                            <TableHead>Loadout</TableHead>
                            <TableHead>Current Status</TableHead>
                            <TableHead className="text-right">Operations</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.map(order => (
                            <TableRow key={order.orderId} className="group">
                                <TableCell className="font-black text-primary">
                                    #{order.orderNumber}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-black uppercase text-xs tracking-tight">{order.customerName}</p>
                                        <p className="text-[10px] text-muted truncate max-w-[200px]">{order.shippingAddress}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="border-card-border/50">
                                        {order.totalItems} UNITS
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(order.status)}>
                                        {order.status.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <RequireRole role={['ADMIN', 'WAREHOUSE_MANAGER', 'STAFF']}>
                                            {order.status === 'PENDING' && (
                                                <Button size="sm" variant="primary" className="h-9 text-[9px]" onClick={() => onAssignPicker(order.orderId)}>
                                                    Deploy
                                                </Button>
                                            )}
                                            {order.status === 'PICK_ASSIGNED' && (
                                                <Button size="sm" className="h-9 text-[9px] bg-purple-600 shadow-purple-600/10" onClick={() => onUpdateStatus(order.orderId, 'mark-picked')}>
                                                    Finalize
                                                </Button>
                                            )}
                                            {order.status === 'PICKED' && (
                                                <Button size="sm" className="h-9 text-[9px] bg-amber-600 shadow-amber-600/10" onClick={() => onUpdateStatus(order.orderId, 'mark-packed')}>
                                                    Seal
                                                </Button>
                                            )}
                                            {order.status === 'PACKED' && (
                                                <Button size="sm" className="h-9 text-[9px] bg-emerald-600 shadow-emerald-600/10" onClick={() => onDispatch(order.orderId)}>
                                                    Dispatch
                                                </Button>
                                            )}
                                        </RequireRole>
                                        <Button variant="ghost" size="icon" onClick={() => onViewDetails(order)} className="h-9 w-9 bg-background border border-card-border/50">
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="py-40 flex flex-col items-center justify-center bg-card rounded-[4rem] border-4 border-dashed border-card-border">
                    <div className="p-8 bg-background rounded-full text-muted/20 mb-6 border-2 border-card-border">
                        <ShoppingBag size={64} strokeWidth={1} />
                    </div>
                    <p className="text-muted font-black text-sm uppercase tracking-[0.4em]">Zero Active Transactions Detected</p>
                </div>
            )}
        </div>
    );
}
