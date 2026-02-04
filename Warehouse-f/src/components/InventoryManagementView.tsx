'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Package, Plus, Search, Edit2, Trash2, AlertTriangle, TrendingUp, TrendingDown, Box } from 'lucide-react';
import toast from 'react-hot-toast';

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
    blockName: string;
    quantity: number;
    reservedQuantity: number;
    availableQuantity: number;
    minStockLevel: number;
    maxStockLevel: number;
    isLowStock: boolean;
}

export default function InventoryManagementView() {
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [editingInventory, setEditingInventory] = useState<Inventory | null>(null);
    const [adjustingInventory, setAdjustingInventory] = useState<Inventory | null>(null);

    const [formData, setFormData] = useState({
        productId: '',
        blockId: '',
        quantity: 0,
        minStockLevel: 0,
        maxStockLevel: 0
    });

    const [adjustmentAmount, setAdjustmentAmount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [inventoriesRes, productsRes, blocksRes] = await Promise.all([
                api.get('/inventory'),
                api.get('/products'),
                api.get('/blocks')
            ]);
            setInventories(inventoriesRes.data.data);
            setProducts(productsRes.data.data);
            setBlocks(blocksRes.data.data);
        } catch (error: unknown) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.productId || !formData.blockId) {
            toast.error('Please select both product and block');
            return;
        }
        setLoading(true);
        try {
            await api.post('/inventory', formData);
            toast.success('Inventory allocated successfully!');
            await fetchData();
            setIsCreating(false);
            resetForm();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create inventory';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingInventory) return;
        setLoading(true);
        try {
            await api.put(`/inventory/${editingInventory.inventoryId}`, {
                quantity: formData.quantity,
                minStockLevel: formData.minStockLevel,
                maxStockLevel: formData.maxStockLevel
            });
            toast.success('Inventory updated successfully!');
            await fetchData();
            setEditingInventory(null);
            resetForm();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update inventory';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdjustStock = async () => {
        if (!adjustingInventory || adjustmentAmount === 0) return;
        setLoading(true);
        try {
            await api.put(`/inventory/${adjustingInventory.inventoryId}/adjust?quantityChange=${adjustmentAmount}`);
            toast.success(`Stock ${adjustmentAmount > 0 ? 'increased' : 'decreased'} successfully!`);
            await fetchData();
            setAdjustingInventory(null);
            setAdjustmentAmount(0);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to adjust stock';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (inventoryId: string) => {
        setLoading(true);
        try {
            await api.delete(`/inventory/${inventoryId}`);
            toast.success('Inventory deleted successfully!');
            await fetchData();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete inventory';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (inventory: Inventory) => {
        setEditingInventory(inventory);
        setFormData({
            productId: inventory.product.productId,
            blockId: inventory.blockId,
            quantity: inventory.quantity,
            minStockLevel: inventory.minStockLevel || 0,
            maxStockLevel: inventory.maxStockLevel || 0
        });
    };

    const resetForm = () => {
        setFormData({
            productId: '',
            blockId: '',
            quantity: 0,
            minStockLevel: 0,
            maxStockLevel: 0
        });
    };

    const filteredInventories = inventories.filter(inv =>
        inv.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.blockName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockCount = inventories.filter(inv => inv.isLowStock).length;

    if (loading && inventories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="text-gray-500 font-medium">Loading inventory...</p>
            </div>
        );
    }

    // Stock Adjustment Modal
    if (adjustingInventory) {
        return (
            <div className="max-w-md mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <header>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Adjust Stock</h3>
                    <p className="text-sm font-medium text-gray-400">
                        {adjustingInventory.product.name} - {adjustingInventory.blockName}
                    </p>
                </header>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="space-y-6">
                        <div className="text-center p-6 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500 mb-2">Current Stock</p>
                            <p className="text-4xl font-black text-gray-900">{adjustingInventory.quantity}</p>
                            <p className="text-xs text-gray-400 mt-2">Available: {adjustingInventory.availableQuantity}</p>
                        </div>

                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                                Adjustment Amount
                            </label>
                            <input
                                type="number"
                                className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-center text-2xl"
                                placeholder="0"
                                value={adjustmentAmount}
                                onChange={e => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                            />
                            <p className="text-xs text-gray-400 mt-2 text-center">
                                Use positive numbers to add stock, negative to remove
                            </p>
                        </div>

                        {adjustmentAmount !== 0 && (
                            <div className="p-4 bg-indigo-50 rounded-xl text-center">
                                <p className="text-sm font-bold text-indigo-900">
                                    New Stock: {adjustingInventory.quantity + adjustmentAmount}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button
                                onClick={handleAdjustStock}
                                className="flex-1 py-6 text-base shadow-lg shadow-indigo-100"
                                isLoading={loading}
                                disabled={adjustmentAmount === 0}
                            >
                                {adjustmentAmount > 0 ? <TrendingUp className="h-5 w-5 mr-2" /> : <TrendingDown className="h-5 w-5 mr-2" />}
                                Adjust Stock
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 py-6 text-base"
                                onClick={() => {
                                    setAdjustingInventory(null);
                                    setAdjustmentAmount(0);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Create/Edit Form
    if (isCreating || editingInventory) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <header>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                        {editingInventory ? 'Edit Inventory' : 'Allocate Product to Block'}
                    </h3>
                    <p className="text-sm font-medium text-gray-400">
                        {editingInventory ? 'Update stock levels and thresholds' : 'Assign a product to a storage block'}
                    </p>
                </header>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <form onSubmit={editingInventory ? handleUpdate : handleCreate} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                                    Product *
                                </label>
                                <select
                                    required
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    value={formData.productId}
                                    onChange={e => setFormData({ ...formData, productId: e.target.value })}
                                    disabled={!!editingInventory}
                                >
                                    <option value="">Select a product</option>
                                    {products.map(p => (
                                        <option key={p.productId} value={p.productId}>
                                            {p.name} ({p.sku})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                                    Storage Block *
                                </label>
                                <select
                                    required
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    value={formData.blockId}
                                    onChange={e => setFormData({ ...formData, blockId: e.target.value })}
                                    disabled={!!editingInventory}
                                >
                                    <option value="">Select a block</option>
                                    {blocks.map(b => (
                                        <option key={b.blockId} value={b.blockId}>
                                            {b.room?.name || 'Unknown Room'} - Block {b.blockId.substring(0, 8)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="0"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                                    Min Stock Level
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="0"
                                    value={formData.minStockLevel}
                                    onChange={e => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                                    Max Stock Level
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="0"
                                    value={formData.maxStockLevel}
                                    onChange={e => setFormData({ ...formData, maxStockLevel: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <Button type="submit" className="flex-1 py-6 text-base shadow-lg shadow-indigo-100" isLoading={loading}>
                                {editingInventory ? 'Update Inventory' : 'Allocate Product'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 py-6 text-base"
                                onClick={() => {
                                    setIsCreating(false);
                                    setEditingInventory(null);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Main List View
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Inventory Management</h3>
                    <p className="text-sm font-medium text-gray-400">Manage stock levels across blocks</p>
                </div>
                <Button onClick={() => setIsCreating(true)} className="rounded-xl px-6 h-12 shadow-lg shadow-indigo-100">
                    <Plus className="h-5 w-5 mr-2" />
                    Allocate Product
                </Button>
            </header>

            {lowStockCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <p className="text-sm font-bold text-amber-900">
                        {lowStockCount} item{lowStockCount > 1 ? 's' : ''} running low on stock
                    </p>
                </div>
            )}

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by product name, SKU, or block..."
                    className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-base focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInventories.map((inventory) => (
                    <div
                        key={inventory.inventoryId}
                        className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative ${inventory.isLowStock ? 'border-amber-200 bg-amber-50/30' : 'border-gray-50'
                            }`}
                    >
                        {inventory.isLowStock && (
                            <div className="absolute top-4 right-4">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Box className="h-5 w-5" />
                            </div>
                        </div>

                        <h4 className="text-lg font-black text-gray-900 mb-1 truncate">{inventory.product.name}</h4>
                        <p className="text-xs text-gray-400 mb-1 font-mono">SKU: {inventory.product.sku}</p>
                        <p className="text-xs text-gray-500 mb-4">📍 {inventory.blockName}</p>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Stock Level</span>
                                <span className="text-2xl font-black text-gray-900">{inventory.quantity}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">Available</span>
                                <span className="font-bold text-green-600">{inventory.availableQuantity}</span>
                            </div>
                            {inventory.reservedQuantity > 0 && (
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Reserved</span>
                                    <span className="font-bold text-orange-600">{inventory.reservedQuantity}</span>
                                </div>
                            )}
                            {inventory.minStockLevel > 0 && (
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Min Level</span>
                                    <span className="font-bold text-gray-600">{inventory.minStockLevel}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setAdjustingInventory(inventory)}
                            >
                                Adjust Stock
                            </Button>
                            <button
                                onClick={() => handleEdit(inventory)}
                                className="p-2 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(inventory.inventoryId)}
                                className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredInventories.length === 0 && (
                    <div className="col-span-full py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">No inventory allocations found</p>
                        <p className="text-xs text-gray-400 mt-2">Click &quot;Allocate Product&quot; to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
