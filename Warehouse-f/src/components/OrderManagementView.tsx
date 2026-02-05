'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { ShipperService, Shipper } from '@/services/ShipperService';
import { ShipmentService } from '@/services/ShipmentService';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Plus } from 'lucide-react';

// Import sub-components
import OrderList from './orders/OrderList';
import OrderForm, { OrderFormData } from './orders/OrderForm';
import AssignPickerModal from './orders/AssignPickerModal';
import DispatchModal from './orders/DispatchModal';
import OrderDetailsModal from './orders/OrderDetailsModal';

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

interface Product {
    productId: string;
    name: string;
    sku: string;
}

interface Warehouse {
    warehouseId: string;
    name: string;
}

export default function OrderManagementView() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');

    const [users, setUsers] = useState<{ username: string; userRole: string }[]>([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignPickerData, setAssignPickerData] = useState({
        orderId: '',
        assignedTo: ''
    });

    // Shipment / Dispatch State
    const [shippers, setShippers] = useState<Shipper[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [dispatchData, setDispatchData] = useState({
        orderId: '',
        shipperId: '',
        warehouseId: '',
        trackingNumber: ''
    });

    useEffect(() => {
        fetchOrders();
        fetchProducts();
        fetchUsers();
        fetchShippers();
        fetchWarehouses();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            if (response.data.status === 200) {
                setUsers(response.data.data || []);
            }
        } catch (error) {
            console.log('Could not fetch users list (likely insufficient permissions)');
        }
    };

    const fetchShippers = async () => {
        try {
            const data = await ShipperService.getActiveShippers();
            setShippers(data);
        } catch (error) {
            console.error('Failed to load shippers');
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await api.get('/warehouses');
            if (response.data.status === 200) {
                setWarehouses(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to load warehouses');
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            if (response.data.status === 200) {
                setOrders(response.data.data || []);
            }
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            if (response.data.status === 200) {
                setProducts(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const createOrder = async (orderData: OrderFormData) => {
        try {
            const response = await api.post('/orders', orderData);
            if (response.data.status === 201) {
                toast.success('Order created successfully');
                setShowCreateModal(false);
                fetchOrders();
            } else {
                toast.error(response.data.message || 'Failed to create order');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create order');
        }
    };

    const openAssignModal = (orderId: string) => {
        setAssignPickerData({ orderId, assignedTo: '' });
        setShowAssignModal(true);
    };

    const assignPicker = async () => {
        if (!assignPickerData.assignedTo) {
            toast.error('Please select a picker');
            return;
        }
        try {
            const response = await api.post('/orders/assign-pickers', assignPickerData);
            if (response.data.status === 200) {
                toast.success('Picker assigned successfully');
                setShowAssignModal(false);
                fetchOrders();
                setAssignPickerData({ orderId: '', assignedTo: '' });
            } else {
                toast.error(response.data.message || 'Failed to assign picker');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to assign picker');
        }
    };

    const updateOrderStatus = async (orderId: string, action: string) => {
        try {
            const response = await api.put(`/orders/${orderId}/${action}`);
            if (response.data.status === 200) {
                toast.success(`Order ${action.replace('mark-', '')} successfully`);
                fetchOrders();
            } else {
                toast.error(response.data.message || `Failed to ${action}`);
            }
        } catch (error) {
            toast.error(`Failed to ${action}`);
        }
    };

    const openDispatchModal = (orderId: string) => {
        setDispatchData({
            orderId,
            shipperId: '',
            warehouseId: warehouses.length > 0 ? warehouses[0].warehouseId : '',
            trackingNumber: ''
        });
        setShowDispatchModal(true);
    };

    const handleDispatch = async () => {
        if (!dispatchData.warehouseId) {
            toast.error('Please select an origin warehouse');
            return;
        }

        try {
            await ShipmentService.createShipment({
                orderId: dispatchData.orderId,
                shipperId: dispatchData.shipperId || undefined,
                warehouseId: dispatchData.warehouseId,
                trackingNumber: dispatchData.trackingNumber || undefined
            });

            await updateOrderStatus(dispatchData.orderId, 'mark-dispatched');

            toast.success('Shipment created and order dispatched!');
            setShowDispatchModal(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create shipment or dispatch order');
        }
    };

    const cancelOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        try {
            const response = await api.put(`/orders/${orderId}/cancel`);
            if (response.data.status === 200) {
                toast.success('Order cancelled successfully');
                fetchOrders();
            } else {
                toast.error(response.data.message || 'Failed to cancel order');
            }
        } catch (error) {
            toast.error('Failed to cancel order');
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl shadow-primary/20"></div>
                <p className="text-muted font-black text-[10px] uppercase tracking-[0.2em]">Synchronizing Order Pipeline...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4">
                        <ShoppingBag className="h-10 w-10 text-primary" />
                        Order Orchestration
                    </h1>
                    <p className="text-sm font-medium text-muted mt-2">Real-time fulfillment logic and pipeline management</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="h-16 px-8 rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group"
                >
                    <Plus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Initialize Order
                </Button>
            </div>

            <OrderList
                orders={orders}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                onAssignPicker={openAssignModal}
                onUpdateStatus={updateOrderStatus}
                onDispatch={openDispatchModal}
                onCancel={cancelOrder}
                onViewDetails={setSelectedOrder}
            />

            {/* Modals */}
            {showAssignModal && (
                <AssignPickerModal
                    orderId={assignPickerData.orderId}
                    users={users}
                    assignedTo={assignPickerData.assignedTo}
                    onAssignedToChange={(username) => setAssignPickerData({ ...assignPickerData, assignedTo: username })}
                    onAssign={assignPicker}
                    onClose={() => setShowAssignModal(false)}
                    isLoading={loading}
                />
            )}

            {showDispatchModal && (
                <DispatchModal
                    orderId={dispatchData.orderId}
                    shippers={shippers}
                    warehouses={warehouses}
                    shipperId={dispatchData.shipperId}
                    warehouseId={dispatchData.warehouseId}
                    trackingNumber={dispatchData.trackingNumber}
                    onShipperChange={(shipperId) => setDispatchData({ ...dispatchData, shipperId })}
                    onWarehouseChange={(warehouseId) => setDispatchData({ ...dispatchData, warehouseId })}
                    onTrackingNumberChange={(trackingNumber) => setDispatchData({ ...dispatchData, trackingNumber })}
                    onDispatch={handleDispatch}
                    onClose={() => setShowDispatchModal(false)}
                    isLoading={loading}
                />
            )}

            {showCreateModal && (
                <OrderForm
                    products={products}
                    onSubmit={createOrder}
                    onClose={() => setShowCreateModal(false)}
                    isLoading={loading}
                />
            )}

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}
