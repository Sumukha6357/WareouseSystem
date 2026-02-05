'use client';

import React, { useState, useEffect } from 'react';
import { ShipperService, Shipper } from '@/services/ShipperService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Truck, Plus, Check, X, Pencil, Trash2, Globe, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ShipperManagementView() {
    const [shippers, setShippers] = useState<Shipper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShipper, setEditingShipper] = useState<Shipper | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'INTERNAL',
        serviceLevel: 'STANDARD',
        trackingUrlTemplate: '',
        contactDetails: ''
    });

    useEffect(() => {
        loadShippers();
    }, []);

    const loadShippers = async () => {
        try {
            setIsLoading(true);
            const data = await ShipperService.getAllShippers();
            setShippers(data);
        } catch (error) {
            console.error('Failed to load shippers:', error);
            toast.error('Failed to load shippers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (shipper?: Shipper) => {
        if (shipper) {
            setEditingShipper(shipper);
            setFormData({
                name: shipper.name,
                type: shipper.type,
                serviceLevel: shipper.serviceLevel,
                trackingUrlTemplate: shipper.trackingUrlTemplate || '',
                contactDetails: shipper.contactDetails || ''
            });
        } else {
            setEditingShipper(null);
            setFormData({
                name: '',
                type: 'INTERNAL',
                serviceLevel: 'STANDARD',
                trackingUrlTemplate: '',
                contactDetails: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingShipper) {
                await ShipperService.updateShipper(editingShipper.shipperId, formData as any);
                toast.success('Shipper updated successfully');
            } else {
                await ShipperService.createShipper(formData as any);
                toast.success('Shipper created successfully');
            }
            setIsModalOpen(false);
            loadShippers();
        } catch (error) {
            console.error('Failed to save shipper:', error);
            toast.error('Failed to save shipper');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this shipper?')) return;
        try {
            await ShipperService.deleteShipper(id);
            toast.success('Shipper deleted successfully');
            loadShippers();
        } catch (error) {
            console.error('Failed to delete shipper:', error);
            toast.error('Failed to delete shipper');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-sharp tracking-tight flex items-center gap-3">
                        <Truck className="h-8 w-8 text-primary" />
                        Logistics Network
                    </h1>
                    <p className="text-sm font-medium text-muted">Orchestrating carrier partners and delivery infrastructure</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="rounded-2xl px-8 h-14 font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/20">
                    <Plus className="w-5 h-5 mr-3" />
                    Register Carrier
                </Button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent shadow-xl"></div>
                    <p className="text-muted font-black text-[10px] uppercase tracking-widest">Querying Logistics Nodes...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {shippers.map((shipper) => (
                        <div key={shipper.shipperId} className="bg-card p-8 rounded-[2.5rem] border-2 border-card-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className="min-w-0">
                                    <h3 className="text-xl font-black text-sharp group-hover:text-primary transition-colors truncate">{shipper.name}</h3>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 border ${shipper.type === 'INTERNAL'
                                        ? 'bg-primary/10 text-primary border-primary/20'
                                        : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                        }`}>
                                        {shipper.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(shipper)}
                                        className="p-3 bg-background hover:bg-primary/10 rounded-xl text-muted hover:text-primary transition-all border border-card-border/50"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(shipper.shipperId)}
                                        className="p-3 bg-background hover:bg-red-500/10 rounded-xl text-muted hover:text-red-500 transition-all border border-card-border/50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 text-xs font-black text-muted uppercase tracking-widest">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                        <Check className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[8px] text-muted/50 mb-0.5">SLA Grade</p>
                                        <span className="text-sharp">{shipper.serviceLevel.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                {shipper.trackingUrlTemplate && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Globe className="w-3 h-3 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[8px] text-muted/50 mb-0.5">Telemetry Hub</p>
                                            <span className="truncate block" title={shipper.trackingUrlTemplate}>
                                                {shipper.trackingUrlTemplate}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {shipper.contactDetails && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-background rounded-lg border border-card-border/50">
                                            <Phone className="w-3 h-3 text-muted" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[8px] text-muted/50 mb-0.5">Control Access</p>
                                            <span className="text-sharp">{shipper.contactDetails}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-card-border/50 flex justify-between items-center">
                                <span className="text-[8px] font-black text-muted/30 uppercase tracking-[0.2em] font-mono">ID: {shipper.shipperId.substring(0, 13)}</span>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${shipper.active ? 'text-emerald-600 bg-emerald-500/5 border-emerald-500/10' : 'text-muted bg-background border-card-border/50'
                                    }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${shipper.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-muted/30'
                                        }`} />
                                    {shipper.active ? 'Operational' : 'Decommissioned'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-in fade-in duration-300">
                    <div className="bg-card rounded-[2.5rem] shadow-2xl shadow-primary/10 max-w-lg w-full p-10 border border-card-border/50 animate-in zoom-in-95 self-center">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-sharp tracking-tight">
                                    {editingShipper ? 'Modify Registry' : 'Carrier Enrollment'}
                                </h3>
                                <p className="text-sm font-medium text-muted mt-1">Configure logistics partner specifications</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-background rounded-2xl text-muted hover:text-sharp transition-all border border-transparent hover:border-card-border/50">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-3 ml-1">Entity Nomenclature *</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Global Express, Strategic Inland"
                                    className="rounded-2xl border-2 py-4 px-6 text-lg font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-3 ml-1">Operational Type</label>
                                    <select
                                        className="w-full rounded-2xl border-2 border-input-border bg-background py-4 px-6 text-sm font-black uppercase tracking-widest text-sharp outline-none appearance-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="INTERNAL">Internal Fleet</option>
                                        <option value="THIRD_PARTY">Contracted Proxy</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-3 ml-1">Priority Class</label>
                                    <select
                                        className="w-full rounded-2xl border-2 border-input-border bg-background py-4 px-6 text-sm font-black uppercase tracking-widest text-sharp outline-none appearance-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                                        value={formData.serviceLevel}
                                        onChange={(e) => setFormData({ ...formData, serviceLevel: e.target.value })}
                                    >
                                        <option value="STANDARD">Standard Route</option>
                                        <option value="NEXT_DAY">Swift Alpha</option>
                                        <option value="SAME_DAY">Prime Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-3 ml-1">Telemetry Integration Path</label>
                                <Input
                                    value={formData.trackingUrlTemplate}
                                    onChange={(e) => setFormData({ ...formData, trackingUrlTemplate: e.target.value })}
                                    placeholder="https://systems.io/track?ref={ID}"
                                    className="rounded-2xl border-2 py-4 px-6"
                                />
                                <p className="text-[10px] text-muted/50 mt-3 font-bold uppercase tracking-widest">Optional. Inject &#123;ID&#125; for dynamic routing.</p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-3 ml-1">Secure Contact Channel</label>
                                <Input
                                    value={formData.contactDetails}
                                    onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
                                    placeholder="Encrypted Email or Direct Line"
                                    className="rounded-2xl border-2 py-4 px-6"
                                />
                            </div>

                            <div className="flex flex-col gap-3 pt-6 border-t border-card-border/50">
                                <Button type="submit" className="w-full py-6 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/20">
                                    {editingShipper ? 'Synchronize Registry' : 'Establish Contract'}
                                </Button>
                                <Button type="button" variant="ghost" className="w-full py-4 text-[10px] font-black uppercase tracking-widest" onClick={() => setIsModalOpen(false)}>
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
