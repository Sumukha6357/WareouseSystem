'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    Building2,
    MapPin,
    Plus,
    Search,
    ArrowRight,
    Trash2,
    X,
    Settings2,
    Warehouse,
    Landmark,
    Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import WarehouseDetailView from './WarehouseDetailView';
import toast from 'react-hot-toast';

interface WarehouseData {
    warehouseId: string;
    name: string;
    city: string;
    address: string;
    landmark: string;
}

export default function WarehouseListView() {
    const { user } = useAuth();
    const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '', city: '', address: '', landmark: ''
    });
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
    const [editingWarehouse, setEditingWarehouse] = useState<WarehouseData | null>(null);
    const [deletingWarehouseId, setDeletingWarehouseId] = useState<string | null>(null);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const response = await api.get('/warehouses');
            setWarehouses(response.data.data || []);
        } catch (error: any) {
            // Only show error if it's not a 404 (no data found)
            if (error.response?.status !== 404) {
                toast.error('Failed to fetch warehouses');
            }
            setWarehouses([]);
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
            toast.success('Warehouse registered successfully!');
            await fetchWarehouses();
            setShowCreateModal(false);
            resetForm();
        } catch (error) {
            toast.error('Failed to register warehouse');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (warehouse: WarehouseData) => {
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
            toast.success('Warehouse updated successfully!');
            await fetchWarehouses();
            setEditingWarehouse(null);
            resetForm();
        } catch (error) {
            toast.error('Failed to update warehouse');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (warehouseId: string) => {
        setLoading(true);
        try {
            await api.delete(`/warehouses/${warehouseId}`);
            toast.success('Warehouse deleted successfully!');
            await fetchWarehouses();
            setDeletingWarehouseId(null);
        } catch (error) {
            toast.error('Failed to delete warehouse');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', city: '', address: '', landmark: '' });
    };

    const filteredWarehouses = warehouses.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedWarehouseId) {
        return <WarehouseDetailView warehouseId={selectedWarehouseId} onBack={() => setSelectedWarehouseId(null)} />;
    }

    if (loading && warehouses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl shadow-primary/20"></div>
                <p className="text-muted font-black text-[10px] uppercase tracking-[0.2em]">Accessing warehouse registry...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4">
                        <Warehouse className="h-10 w-10 text-primary" />
                        Logistics Network
                    </h1>
                    <p className="text-sm font-medium text-muted mt-2">Active distribution hubs and storage terminals</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="h-16 px-8 rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group"
                >
                    <Plus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Register Hub
                </Button>
            </header>

            <div className="relative group max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Scan by identity or city location..."
                    className="w-full pl-16 pr-8 py-5 bg-card border-2 border-input-border rounded-[2rem] text-sm font-black uppercase tracking-widest text-sharp focus:ring-4 focus:ring-primary/10 transition-all shadow-sm outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredWarehouses.map((warehouse) => (
                    <div
                        key={warehouse.warehouseId}
                        className="bg-card rounded-[3rem] p-10 border-2 border-card-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col"
                    >
                        {deletingWarehouseId === warehouse.warehouseId && (
                            <div className="absolute inset-0 bg-background/95 backdrop-blur-md z-[10] flex flex-col items-center justify-center p-10 gap-6 animate-in fade-in zoom-in-95">
                                <Activity className="h-12 w-12 text-red-500 animate-pulse mb-4" />
                                <div className="text-center">
                                    <p className="text-sm font-black text-sharp uppercase tracking-widest mb-2">Deactivate Node?</p>
                                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest">This asset link will be severed.</p>
                                </div>
                                <div className="flex flex-col w-full gap-3 mt-4">
                                    <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 h-12 text-[10px] font-black uppercase tracking-widest" onClick={() => handleDelete(warehouse.warehouseId)} isLoading={loading}>
                                        Confirm Severance
                                    </Button>
                                    <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest" onClick={() => setDeletingWarehouseId(null)}>
                                        Stand Down
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-8">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                <Building2 className="h-7 w-7" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(warehouse)}
                                    className="h-10 w-10 flex items-center justify-center bg-background hover:bg-primary/10 rounded-xl text-muted hover:text-primary transition-all border border-card-border/50 shadow-sm"
                                >
                                    <Settings2 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setDeletingWarehouseId(warehouse.warehouseId)}
                                    className="h-10 w-10 flex items-center justify-center bg-background hover:bg-red-500/10 rounded-xl text-muted hover:text-red-500 transition-all border border-card-border/50 shadow-sm"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <h4 className="text-2xl font-black text-sharp mb-2 truncate group-hover:text-primary transition-colors pr-8">
                            {warehouse.name}
                        </h4>

                        <div className="flex flex-wrap gap-2 mb-8">
                            <span className="text-[10px] font-black text-muted uppercase tracking-widest bg-background/50 px-3 py-1.5 rounded-xl border border-card-border/50 flex items-center gap-2">
                                <MapPin size={12} className="text-primary/60" />
                                {warehouse.city}
                            </span>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 flex items-center gap-2">
                                <Landmark size={12} />
                                {warehouse.landmark}
                            </span>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            <div className="p-4 bg-background/50 rounded-2xl border border-card-border/30">
                                <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-2 leading-none">Primary Vector</p>
                                <p className="text-sm font-medium text-sharp leading-relaxed italic line-clamp-2">"{warehouse.address}"</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedWarehouseId(warehouse.warehouseId)}
                            className="w-full pt-8 border-t border-card-border/30 flex items-center justify-between text-primary group-hover:text-sharp transition-colors"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Inspect Node</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-3 transition-transform duration-500" />
                        </button>
                    </div>
                ))}

                {filteredWarehouses.length === 0 && (
                    <div className="col-span-full py-40 border-4 border-dashed border-card-border rounded-[4rem] text-center bg-card/30">
                        <Warehouse className="h-24 w-24 text-muted/10 mx-auto mb-8" />
                        <p className="text-muted font-black uppercase tracking-[0.5em] text-sm">Registry Null Result</p>
                        <p className="text-[10px] text-muted/40 mt-6 font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                            No logistics nodes detected in the current filter scope. Initialize registration protocol to populate the network.
                        </p>
                        <Button
                            variant="ghost"
                            className="mt-10 text-[10px] font-black uppercase tracking-widest"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Executive Registration
                        </Button>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            {(showCreateModal || editingWarehouse) && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-500">
                    <div className="bg-card rounded-[4rem] p-12 max-w-2xl w-full border-2 border-card-border shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <div className="flex justify-between items-start mb-12 sticky top-0 bg-card z-10 pb-4 border-b border-card-border/30">
                            <div>
                                <h3 className="text-4xl font-black text-sharp tracking-tighter">
                                    {editingWarehouse ? 'Edit Identity' : 'Register Asset'}
                                </h3>
                                <p className="text-sm font-medium text-muted mt-2">
                                    {editingWarehouse ? 'Adjusting distribution node parameters' : 'Integrating new logistics hub into the federation'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingWarehouse(null);
                                    resetForm();
                                }}
                                className="p-4 bg-background rounded-3xl text-muted hover:text-sharp transition-all border border-card-border/50 shadow-sm"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <form onSubmit={editingWarehouse ? handleUpdate : handleCreate} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Hub Identity *"
                                        required
                                        className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                        placeholder="e.g. ALPHA_LOGISTICS_CENTER"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="City Location *"
                                        required
                                        className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                        placeholder="e.g. New York"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Primary Landmark *"
                                        required
                                        className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                        placeholder="Near Tech Park"
                                        value={formData.landmark}
                                        onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-4 ml-2">Street Address *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full rounded-[2rem] border-2 border-input-border bg-background py-6 px-8 focus:ring-8 focus:ring-primary/10 transition-all font-medium text-sharp outline-none shadow-sm"
                                        placeholder="Define precise vector..."
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-card-border/30">
                                <Button
                                    type="submit"
                                    className="flex-1 py-7 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/30 h-18"
                                    isLoading={loading}
                                >
                                    {editingWarehouse ? 'Finalize Logic Update' : 'Initialize Asset Link'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingWarehouse(null);
                                        resetForm();
                                    }}
                                >
                                    Abort Operation
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
