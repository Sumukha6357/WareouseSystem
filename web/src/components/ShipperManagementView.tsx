'use client';

import React, { useState, useEffect } from 'react';
import { ShipperService } from '@/services/ShipperService';
import type { ShipperResponse as Shipper } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Truck, Plus, Check, X, Pencil, Trash2, Globe, Phone, Settings2 } from 'lucide-react';
import { notify } from '@/lib/notify';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorState from './ui/ErrorState';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { FormField } from './ui/FormField';


type ShipperFormData = {
    name: string;
    type: Shipper['type'];
    serviceLevel: Shipper['serviceLevel'];
    trackingUrlTemplate: string;
    contactDetails: string;
};

export default function ShipperManagementView() {
    const [shippers, setShippers] = useState<Shipper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShipper, setEditingShipper] = useState<Shipper | null>(null);

    // Form State
    const [formData, setFormData] = useState<ShipperFormData>({
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
            setError(true);
            notify.error('Failed to load shippers');
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
                await ShipperService.updateShipper(editingShipper.shipperId, formData);
                notify.success('Shipper updated successfully');
            } else {
                await ShipperService.createShipper(formData);
                notify.success('Shipper created successfully');
            }
            setIsModalOpen(false);
            loadShippers();
        } catch (error) {
            console.error('Failed to save shipper:', error);
            notify.error('Failed to save shipper');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this shipper?')) return;
        try {
            await ShipperService.deleteShipper(id);
            notify.success('Shipper deleted successfully');
            loadShippers();
        } catch (error) {
            console.error('Failed to delete shipper:', error);
            notify.error('Failed to delete shipper');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-sharp tracking-tight flex items-center gap-3 italic uppercase">
                        <Truck className="h-8 w-8 text-primary" />
                        Logistics Network
                    </h1>
                    <p className="text-sm font-medium text-muted">Orchestrating carrier partners and delivery infrastructure</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="rounded-2xl px-8 h-14" variant="primary">
                    <Plus className="w-5 h-5 mr-3" />
                    Register Carrier
                </Button>
            </div>

            {isLoading && shippers.length === 0 ? (
                <LoadingSpinner message="Querying Logistics Nodes..." />
            ) : error ? (
                <ErrorState onRetry={() => { setError(false); setIsLoading(true); loadShippers(); }} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {shippers.map((shipper) => (
                        <Card key={shipper.shipperId} className="p-0 overflow-hidden">
                            <CardHeader className="flex flex-row justify-between items-start pb-4">
                                <div className="min-w-0">
                                    <h3 className="text-xl font-black text-sharp group-hover:text-primary transition-colors truncate uppercase italic">{shipper.name}</h3>
                                    <Badge variant={shipper.type === 'INTERNAL' ? 'primary' : 'warning'} className="mt-2">
                                        {shipper.type.replace('_', ' ')}
                                    </Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleOpenModal(shipper)}
                                        className="h-10 w-10 flex items-center justify-center bg-background border border-card-border/50"
                                    >
                                        <Settings2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(shipper.shipperId)}
                                        className="h-10 w-10 flex items-center justify-center bg-background border border-card-border/50 hover:text-red-500 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-4 p-4 bg-background/50 rounded-2xl border border-card-border/30">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                                            <Check className="w-3 h-3 text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[8px] font-black text-muted uppercase tracking-widest leading-none mb-1">SLA Grade</p>
                                            <span className="text-sm font-black text-sharp uppercase tracking-tight">{shipper.serviceLevel.replace('_', ' ')}</span>
                                        </div>
                                    </div>

                                    {shipper.trackingUrlTemplate && (
                                        <div className="flex items-center gap-4 p-4 bg-background/50 rounded-2xl border border-card-border/30">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Globe className="w-3 h-3 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[8px] font-black text-muted uppercase tracking-widest leading-none mb-1">Telemetry Hub</p>
                                                <span className="text-xs font-bold text-sharp truncate block" title={shipper.trackingUrlTemplate}>
                                                    {shipper.trackingUrlTemplate}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {shipper.contactDetails && (
                                        <div className="flex items-center gap-4 p-4 bg-background/50 rounded-2xl border border-card-border/30">
                                            <div className="p-2 bg-card rounded-lg border border-card-border/50">
                                                <Phone className="w-3 h-3 text-muted" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[8px] font-black text-muted uppercase tracking-widest leading-none mb-1">Control Access</p>
                                                <span className="text-sm font-black text-sharp">{shipper.contactDetails}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-6 border-t border-card-border/50 flex justify-between items-center">
                                    <span className="text-[8px] font-black text-muted/30 uppercase tracking-[0.2em] font-mono">ID: {shipper.shipperId.substring(0, 13)}</span>
                                    <Badge variant={shipper.active ? 'success' : 'outline'} className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${shipper.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-muted/30'}`} />
                                        {shipper.active ? 'Operational' : 'Decommissioned'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingShipper ? 'Modify Registry' : 'Carrier Enrollment'}
            >
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div>
                        <FormField
                            label="Entity Nomenclature *"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Global Express, Strategic Inland"
                            className="text-lg font-black"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-4 ml-2">Operational Type</label>
                            <select
                                className="w-full rounded-[2rem] border-2 border-input-border bg-background py-5 px-8 text-sm font-black uppercase tracking-widest text-sharp outline-none appearance-none focus:ring-8 focus:ring-primary/10 transition-all cursor-pointer shadow-sm"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as Shipper['type'] })}
                            >
                                <option value="INTERNAL">Internal Fleet</option>
                                <option value="THIRD_PARTY">Contracted Proxy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-4 ml-2">Priority Class</label>
                            <select
                                className="w-full rounded-[2rem] border-2 border-input-border bg-background py-5 px-8 text-sm font-black uppercase tracking-widest text-sharp outline-none appearance-none focus:ring-8 focus:ring-primary/10 transition-all cursor-pointer shadow-sm"
                                value={formData.serviceLevel}
                                onChange={(e) => setFormData({ ...formData, serviceLevel: e.target.value as Shipper['serviceLevel'] })}
                            >
                                <option value="STANDARD">Standard Route</option>
                                <option value="NEXT_DAY">Swift Alpha</option>
                                <option value="SAME_DAY">Prime Critical</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <FormField
                            label="Telemetry Integration Path"
                            value={formData.trackingUrlTemplate}
                            onChange={(e) => setFormData({ ...formData, trackingUrlTemplate: e.target.value })}
                            placeholder="https://systems.io/track?ref={ID}"
                        />
                        <p className="text-[10px] text-muted/50 mt-3 font-black uppercase tracking-widest ml-4 italic">Optional. Inject &#123;ID&#125; for dynamic routing.</p>
                    </div>

                    <div>
                        <FormField
                            label="Secure Contact Channel"
                            value={formData.contactDetails}
                            onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
                            placeholder="Encrypted Email or Direct Line"
                        />
                    </div>

                    <div className="flex flex-col gap-3 pt-6 border-t border-card-border/50">
                        <Button type="submit" className="w-full py-6 text-xs h-16 shadow-2xl shadow-primary/20">
                            {editingShipper ? 'Synchronize Registry' : 'Establish Contract'}
                        </Button>
                        <Button type="button" variant="ghost" className="w-full py-4 text-[10px]" onClick={() => setIsModalOpen(false)}>
                            Abort Operation
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
