'use client';

import React, { useEffect, useState } from 'react';
import httpClient from '@/lib/httpClient';
import type { InventoryResponse, ProductResponse, BlockResponse } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Package, Plus } from 'lucide-react';
import { notify } from '@/lib/notify';
import RequireRole from './auth/RequireRole';

// Import sub-components
import InventoryList from './inventory/InventoryList';
import InventoryForm, { InventoryFormData } from './inventory/InventoryForm';
import StockAdjustmentModal from './inventory/StockAdjustmentModal';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function InventoryManagementView() {
    const [inventories, setInventories] = useState<InventoryResponse[]>([]);
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [blocks, setBlocks] = useState<BlockResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingInventory, setEditingInventory] = useState<InventoryResponse | null>(null);
    const [adjustingInventory, setAdjustingInventory] = useState<InventoryResponse | null>(null);
    const [adjustmentAmount, setAdjustmentAmount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    // WebSocket Integration for real-time inventory updates
    useWebSocket('/topic/inventory', () => {
        console.log('Inventory update received');
        fetchData();
    });

    const fetchData = async () => {
        try {
            const [inventoriesData, productsData, blocksData] = await Promise.all([
                httpClient.get<InventoryResponse[]>('/inventory'),
                httpClient.get<ProductResponse[]>('/products'),
                httpClient.get<BlockResponse[]>('/blocks'),
            ]);
            setInventories(inventoriesData || []);
            setProducts(productsData || []);
            setBlocks(blocksData || []);
        } catch {
            notify.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (formData: InventoryFormData) => {
        setLoading(true);
        try {
            if (editingInventory) {
                await httpClient.put(`/inventory/${editingInventory.inventoryId}`, {
                    quantity: formData.quantity,
                    minStockLevel: formData.minStockLevel,
                    maxStockLevel: formData.maxStockLevel,
                });
                notify.success('Inventory updated successfully!');
            } else {
                if (!formData.productId || !formData.blockId) {
                    notify.error('Please select both product and block');
                    return;
                }
                await httpClient.post('/inventory', formData);
                notify.success('Inventory allocated successfully!');
            }
            await fetchData();
            setShowCreateModal(false);
            setEditingInventory(null);
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : `Failed to ${editingInventory ? 'update' : 'create'} inventory`;
            notify.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdjustStock = async () => {
        if (!adjustingInventory || adjustmentAmount === 0) return;
        setLoading(true);
        try {
            await httpClient.putWithParams(`/inventory/${adjustingInventory.inventoryId}/adjust`, {
                quantityChange: adjustmentAmount,
            });
            notify.success(`Stock ${adjustmentAmount > 0 ? 'increased' : 'decreased'} successfully!`);
            await fetchData();
            setAdjustingInventory(null);
            setAdjustmentAmount(0);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to adjust stock';
            notify.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (inventoryId: string) => {
        if (!confirm('Abort this inventory node? This action is permanent.')) return;
        setLoading(true);
        try {
            await httpClient.delete(`/inventory/${inventoryId}`);
            notify.success('Inventory deleted successfully!');
            await fetchData();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to delete inventory';
            notify.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (inventory: InventoryResponse) => {
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
                <RequireRole role={['ADMIN', 'WAREHOUSE_MANAGER']}>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="h-16 px-8 rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group"
                    >
                        <Plus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Allocate Resource
                    </Button>
                </RequireRole>
            </header>

            <InventoryList
                inventories={inventories as unknown as Parameters<typeof InventoryList>[0]['inventories']}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAdjust={setAdjustingInventory as unknown as Parameters<typeof InventoryList>[0]['onAdjust']}
                onEdit={handleEdit as unknown as Parameters<typeof InventoryList>[0]['onEdit']}
                onDelete={handleDelete}
                onCreateClick={() => setShowCreateModal(true)}
            />

            {/* Modals */}
            {adjustingInventory && (
                <StockAdjustmentModal
                    inventory={adjustingInventory as unknown as Parameters<typeof StockAdjustmentModal>[0]['inventory']}
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
                    products={products as unknown as Parameters<typeof InventoryForm>[0]['products']}
                    blocks={blocks as unknown as Parameters<typeof InventoryForm>[0]['blocks']}
                    editingInventory={editingInventory as unknown as Parameters<typeof InventoryForm>[0]['editingInventory']}
                    onSubmit={handleCreateOrUpdate}
                    onClose={handleCloseForm}
                    isLoading={loading}
                />
            )}
        </div>
    );
}
