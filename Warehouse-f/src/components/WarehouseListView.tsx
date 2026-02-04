'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Building2, MapPin, Navigation, Plus, Search, Tag, ArrowRight, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import WarehouseDetailView from './WarehouseDetailView';

interface Warehouse {
    warehouseId: string;
    name: string;
    city: string;
    address: string;
    landmark: string;
}

export default function WarehouseListView() {
    const { user } = useAuth();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '', city: '', address: '', landmark: ''
    });
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const [deletingWarehouseId, setDeletingWarehouseId] = useState<string | null>(null);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const response = await api.get('/warehouses');
            setWarehouses(response.data.data);
        } catch (error) {
            console.error('Failed to fetch warehouses', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            await api.post(`/warehouses/${user.userId}`, formData);
            await fetchWarehouses();
            setIsCreating(false);
            setFormData({ name: '', city: '', address: '', landmark: '' });
        } catch (error) {
            console.error('Failed to create warehouse', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (warehouse: Warehouse) => {
        setEditingWarehouse(warehouse);
        setFormData({
            name: warehouse.name,
            city: warehouse.city,
            address: warehouse.address,
            landmark: warehouse.landmark
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingWarehouse) return;
        setLoading(true);
        try {
            await api.put(`/warehouses/${editingWarehouse.warehouseId}`, formData);
            await fetchWarehouses();
            setEditingWarehouse(null);
            setFormData({ name: '', city: '', address: '', landmark: '' });
        } catch (error) {
            console.error('Failed to update warehouse', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (warehouseId: string) => {
        setLoading(true);
        try {
            await api.delete(`/warehouses/${warehouseId}`);
            await fetchWarehouses();
            setDeletingWarehouseId(null);
        } catch (error) {
            console.error('Failed to delete warehouse', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredWarehouses = warehouses.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Show detail view if a warehouse is selected
    if (selectedWarehouseId) {
        return <WarehouseDetailView warehouseId={selectedWarehouseId} onBack={() => setSelectedWarehouseId(null)} />;
    }

    if (loading && warehouses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="text-gray-500 font-medium">Accessing warehouse registry...</p>
            </div>
        );
    }

    if (isCreating || editingWarehouse) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <header>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                        {editingWarehouse ? 'Edit Warehouse' : 'Register New Warehouse'}
                    </h3>
                    <p className="text-sm font-medium text-gray-400">
                        {editingWarehouse ? 'Update warehouse information' : 'Add a new logistics hub to the system'}
                    </p>
                </header>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 ring-1 ring-gray-900/5">
                    <form onSubmit={editingWarehouse ? handleUpdate : handleCreate} className="space-y-6">
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Warehouse Identity</label>
                            <input
                                type="text"
                                required
                                className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                placeholder="e.g. North Star Distribution Center"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">City Location</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Primary Landmark</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    value={formData.landmark}
                                    onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Street Address</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-4 pt-2">
                            <Button type="submit" className="flex-1 py-6 text-base shadow-lg shadow-indigo-100" isLoading={loading}>
                                {editingWarehouse ? 'Update Warehouse' : 'Register Asset'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 py-6 text-base"
                                onClick={() => {
                                    setIsCreating(false);
                                    setEditingWarehouse(null);
                                    setFormData({ name: '', city: '', address: '', landmark: '' });
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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Enterprise Warehouses</h3>
                    <p className="text-sm font-medium text-gray-400">Overview of all active distribution nodes</p>
                </div>
                <Button onClick={() => setIsCreating(true)} className="rounded-xl px-6 h-12 shadow-lg shadow-indigo-100">
                    <Plus className="h-5 w-5 mr-2" />
                    Register New
                </Button>
            </header>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name or city..."
                    className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-base focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWarehouses.map((warehouse) => (
                    <div key={warehouse.warehouseId} className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative">
                        {/* Delete Confirmation Overlay */}
                        {deletingWarehouseId === warehouse.warehouseId && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl z-10 flex flex-col items-center justify-center p-6 gap-4">
                                <p className="text-sm font-bold text-gray-900 text-center">Delete this warehouse?</p>
                                <p className="text-xs text-gray-500 text-center">This action cannot be undone.</p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDeletingWarehouseId(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => handleDelete(warehouse.warehouseId)}
                                        isLoading={loading}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(warehouse)}
                                    className="p-2 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                                    title="Edit warehouse"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setDeletingWarehouseId(warehouse.warehouseId)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                                    title="Delete warehouse"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <h4 className="text-xl font-black text-gray-900 mb-2 truncate">{warehouse.name}</h4>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                <MapPin className="h-4 w-4 text-indigo-400" />
                                {warehouse.city}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Tag className="h-4 w-4 text-gray-300" />
                                Near {warehouse.landmark}
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedWarehouseId(warehouse.warehouseId)}
                            className="w-full pt-6 border-t border-gray-50 flex items-center justify-between text-indigo-600 font-bold text-sm hover:text-indigo-700 transition-colors"
                        >
                            View Details
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                ))}

                {filteredWarehouses.length === 0 && (
                    <div className="col-span-full py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                        <p className="text-gray-400 font-medium">No results found for your query</p>
                    </div>
                )}
            </div>
        </div>
    );
}
