'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Package, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

// Import sub-components
import InventoryList from './inventory/InventoryList';
import InventoryForm, { InventoryFormData } from './inventory/InventoryForm';
import StockAdjustmentModal from './inventory/StockAdjustmentModal';

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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingInventory, setEditingInventory] = useState<Inventory | null>(null);
    const [adjustingInventory, setAdjustingInventory] = useState<Inventory | null>(null);
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
            setInventories(inventoriesRes.data.data || []);
            setProducts(productsRes.data.data || []);
            setBlocks(blocksRes.data.data || []);
        } catch (error: unknown) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (formData: InventoryFormData) => {
        setLoading(true);
        try {
            if (editingInventory) {
                await api.put(`/inventory/${editingInventory.inventoryId}`, {
                    quantity: formData.quantity,
                    minStockLevel: formData.minStockLevel,
                    maxStockLevel: formData.maxStockLevel
                });
                toast.success('Inventory updated successfully!');
            } else {
                if (!formData.productId || !formData.blockId) {
                    toast.error('Please select both product and block');
                    return;
                }
                await api.post('/inventory', formData);
                toast.success('Inventory allocated successfully!');
            }
            await fetchData();
            setShowCreateModal(false);
            setEditingInventory(null);
        } catch (error: any) {
            const message = error.response?.data?.message || `Failed to ${editingInventory ? 'update' : 'create'} inventory`;
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
        if (!confirm('Abort this inventory node? This action is permanent.')) return;
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
    };

    const handleCloseForm = () => {
        setShowCreateModal(false);
        setEditingInventory(null);
    };

    if (loading && inventories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl shadow-primary/20"></div>
                <p className="text-muted font-black text-[10px] uppercase tracking-[0.2em]">Synchronizing inventory matrix...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4">
                        <Package className="h-10 w-10 text-primary" />
                        Inventory Control
                    </h1>
                    <p className="text-sm font-medium text-muted mt-2">Orchestrating asset distribution across storage nodes</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="h-16 px-8 rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group"
                >
                    <Plus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Allocate Resource
                </Button>
            </header>

            <InventoryList
                inventories={inventories}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAdjust={setAdjustingInventory}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreateClick={() => setShowCreateModal(true)}
            />

            {/* Modals */}
            {adjustingInventory && (
                <StockAdjustmentModal
                    inventory={adjustingInventory}
                    adjustmentAmount={adjustmentAmount}
                    onAdjustmentChange={setAdjustmentAmount}
                    onAdjust={handleAdjustStock}
                    onClose={() => {
                        setAdjustingInventory(null);
                        setAdjustmentAmount(0);
                    }}
                    isLoading={loading}
                />
            )}

            {(showCreateModal || editingInventory) && (
                <InventoryForm
                    products={products}
                    blocks={blocks}
                    editingInventory={editingInventory}
                    onSubmit={handleCreateOrUpdate}
                    onClose={handleCloseForm}
                    isLoading={loading}
                />
            )}
        </div>
    );
}
