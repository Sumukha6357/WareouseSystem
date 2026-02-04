'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

import { ShipperService, Shipper } from '@/services/ShipperService';
import { ShipmentService } from '@/services/ShipmentService';

interface OrderItem {
    productId: string;
    quantity: number;
}

interface OrderRequest {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    notes?: string;
    items: OrderItem[];
}

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

    const [newOrder, setNewOrder] = useState<OrderRequest>({
        orderNumber: '',
        customerName: '',
        customerEmail: '',
        shippingAddress: '',
        notes: '',
        items: [{ productId: '', quantity: 1 }]
    });

    const [assignPickerData, setAssignPickerData] = useState({
        orderId: '',
        assignedTo: ''
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

    const createOrder = async () => {
        try {
            const response = await api.post('/orders', newOrder);
            if (response.data.status === 201) {
                toast.success('Order created successfully');
                setShowCreateModal(false);
                fetchOrders();
                resetNewOrder();
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
            // 1. Create Shipment
            await ShipmentService.createShipment({
                orderId: dispatchData.orderId,
                shipperId: dispatchData.shipperId || undefined,
                warehouseId: dispatchData.warehouseId,
                trackingNumber: dispatchData.trackingNumber || undefined
            });

            // 2. Mark Order as Dispatched
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

    const resetNewOrder = () => {
        setNewOrder({
            orderNumber: '',
            customerName: '',
            customerEmail: '',
            shippingAddress: '',
            notes: '',
            items: [{ productId: '', quantity: 1 }]
        });
    };

    const addOrderItem = () => {
        setNewOrder({
            ...newOrder,
            items: [...newOrder.items, { productId: '', quantity: 1 }]
        });
    };

    const removeOrderItem = (index: number) => {
        setNewOrder({
            ...newOrder,
            items: newOrder.items.filter((_, i) => i !== index)
        });
    };

    const updateOrderItem = (index: number, field: string, value: any) => {
        const updatedItems = [...newOrder.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setNewOrder({ ...newOrder, items: updatedItems });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-gray-100 text-gray-800',
            PICK_ASSIGNED: 'bg-blue-100 text-blue-800',
            PICKED: 'bg-purple-100 text-purple-800',
            PACKED: 'bg-orange-100 text-orange-800',
            DISPATCHED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredOrders = filterStatus === 'ALL'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    if (loading) {
        return <div className="p-8 text-center">Loading orders...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Order Management</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Create Order
                </button>
            </div>

            <div className="mb-4 flex gap-2">
                {['ALL', 'PENDING', 'PICK_ASSIGNED', 'PICKED', 'PACKED', 'DISPATCHED'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1 rounded ${filterStatus === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="grid gap-4">
                {filteredOrders.map(order => (
                    <div key={order.orderId} className="bg-white border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                                <p className="text-gray-600">{order.customerName}</p>
                                <p className="text-sm text-gray-500">{order.customerEmail}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                            <p><strong>Items:</strong> {order.totalItems}</p>
                            <p><strong>Address:</strong> {order.shippingAddress}</p>
                            {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-wrap">
                            {order.status === 'PENDING' && (
                                <button
                                    onClick={() => openAssignModal(order.orderId)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    Assign Picker
                                </button>
                            )}
                            {order.status === 'PICK_ASSIGNED' && (
                                <button
                                    onClick={() => updateOrderStatus(order.orderId, 'mark-picked')}
                                    className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                                >
                                    Mark Picked
                                </button>
                            )}
                            {order.status === 'PICKED' && (
                                <button
                                    onClick={() => updateOrderStatus(order.orderId, 'mark-packed')}
                                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                                >
                                    Mark Packed
                                </button>
                            )}
                            {order.status === 'PACKED' && (
                                <button
                                    onClick={() => openDispatchModal(order.orderId)}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                >
                                    Mark Dispatched
                                </button>
                            )}
                            {order.status !== 'DISPATCHED' && order.status !== 'CANCELLED' && (
                                <button
                                    onClick={() => cancelOrder(order.orderId)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Assign Picker Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Assign Picker</h2>
                        <p className="text-sm text-gray-500 mb-4">Select a staff member to pick this order.</p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Select User</label>
                            {users.length > 0 ? (
                                <select
                                    value={assignPickerData.assignedTo}
                                    onChange={(e) => setAssignPickerData({ ...assignPickerData, assignedTo: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="">-- Select Picker --</option>
                                    {users.map(u => (
                                        <option key={u.username} value={u.username}>
                                            {u.username} ({u.userRole})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="Enter username manually"
                                    value={assignPickerData.assignedTo}
                                    onChange={(e) => setAssignPickerData({ ...assignPickerData, assignedTo: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            )}
                            {users.length === 0 && (
                                <p className="text-xs text-orange-500 mt-1">
                                    Could not load user list (Admin only). Please enter username manually.
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={assignPicker}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Assign
                            </button>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dispatch Order Modal */}
            {showDispatchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Create Shipment & Dispatch</h2>
                        <p className="text-sm text-gray-500 mb-4">Assign a carrier and dispatch this order.</p>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Select Shipper (Carrier)</label>
                                <select
                                    value={dispatchData.shipperId}
                                    onChange={(e) => setDispatchData({ ...dispatchData, shipperId: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="">-- Select Shipper --</option>
                                    {shippers.map(s => (
                                        <option key={s.shipperId} value={s.shipperId}>
                                            {s.name} ({s.serviceLevel.replace('_', ' ')})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Origin Warehouse</label>
                                <select
                                    value={dispatchData.warehouseId}
                                    onChange={(e) => setDispatchData({ ...dispatchData, warehouseId: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="">-- Select Warehouse --</option>
                                    {warehouses.map(w => (
                                        <option key={w.warehouseId} value={w.warehouseId}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Tracking Number (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Enter tracking number"
                                    value={dispatchData.trackingNumber}
                                    onChange={(e) => setDispatchData({ ...dispatchData, trackingNumber: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleDispatch}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Dispatch Order
                            </button>
                            <button
                                onClick={() => setShowDispatchModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Order Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Create New Order</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Order Number</label>
                                <input
                                    type="text"
                                    value={newOrder.orderNumber}
                                    onChange={(e) => setNewOrder({ ...newOrder, orderNumber: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                    placeholder="ORD-001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    value={newOrder.customerName}
                                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Customer Email</label>
                                <input
                                    type="email"
                                    value={newOrder.customerEmail}
                                    onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Shipping Address</label>
                                <textarea
                                    value={newOrder.shippingAddress}
                                    onChange={(e) => setNewOrder({ ...newOrder, shippingAddress: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                                <textarea
                                    value={newOrder.notes}
                                    onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Order Items</label>
                                {newOrder.items.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <select
                                            value={item.productId}
                                            onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
                                            className="flex-1 px-3 py-2 border rounded"
                                        >
                                            <option value="">Select Product</option>
                                            {products.map(product => (
                                                <option key={product.productId} value={product.productId}>
                                                    {product.name} ({product.sku})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                                            className="w-24 px-3 py-2 border rounded"
                                            placeholder="Qty"
                                        />
                                        {newOrder.items.length > 1 && (
                                            <button
                                                onClick={() => removeOrderItem(index)}
                                                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addOrderItem}
                                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                                >
                                    Add Item
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={createOrder}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Create Order
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetNewOrder();
                                }}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Order Details</h2>

                        <div className="space-y-3 mb-6">
                            <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                            <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                            <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                            <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
                            <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status}
                            </span></p>
                            <p><strong>Total Items:</strong> {selectedOrder.totalItems}</p>
                            {selectedOrder.notes && <p><strong>Notes:</strong> {selectedOrder.notes}</p>}
                        </div>

                        <h3 className="font-semibold mb-2">Pick Tasks</h3>
                        <div className="space-y-2 mb-4">
                            {selectedOrder.pickTasks?.map(task => (
                                <div key={task.taskId} className="border p-3 rounded">
                                    <p><strong>Product:</strong> {task.product.name} ({task.product.sku})</p>
                                    <p><strong>Block:</strong> {task.blockName}</p>
                                    <p><strong>Quantity:</strong> {task.quantity}</p>
                                    <p><strong>Assigned To:</strong> {task.assignedTo || 'Unassigned'}</p>
                                    <p><strong>Status:</strong> {task.status}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
