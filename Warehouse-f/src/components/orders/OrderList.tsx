'use client';

import React from 'react';
import OrderCard from './OrderCard';
import { ShoppingBag } from 'lucide-react';

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
        <>
            {/* Status Filter */}
            <div className="flex flex-wrap gap-3 p-2 bg-card rounded-[2rem] border-2 border-card-border w-fit shadow-sm">
                {['ALL', 'PENDING', 'PICK_ASSIGNED', 'PICKED', 'PACKED', 'DISPATCHED', 'CANCELLED'].map(status => (
                    <button
                        key={status}
                        onClick={() => onFilterChange(status)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-transparent text-muted hover:bg-background hover:text-sharp'
                            }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <OrderCard
                            key={order.orderId}
                            order={order}
                            onAssignPicker={onAssignPicker}
                            onUpdateStatus={onUpdateStatus}
                            onDispatch={onDispatch}
                            onCancel={onCancel}
                            onViewDetails={onViewDetails}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center bg-card rounded-[4rem] border-4 border-dashed border-card-border">
                        <div className="p-8 bg-background rounded-full text-muted/20 mb-6 border-2 border-card-border">
                            <ShoppingBag size={64} strokeWidth={1} />
                        </div>
                        <p className="text-muted font-black text-sm uppercase tracking-[0.4em]">Zero Active Transactions Detected</p>
                    </div>
                )}
            </div>
        </>
    );
}
