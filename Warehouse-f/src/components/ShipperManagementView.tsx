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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Truck className="h-8 w-8 text-indigo-600" />
                        Shipper Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage carriers and delivery partners</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Shipper
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shippers.map((shipper) => (
                        <Card key={shipper.shipperId} className="p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{shipper.name}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${shipper.type === 'INTERNAL'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {shipper.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(shipper)}
                                        className="text-gray-400 hover:text-indigo-600 p-1"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(shipper.shipperId)}
                                        className="text-gray-400 hover:text-red-600 p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span className="font-medium">Service Level:</span>
                                    {shipper.serviceLevel.replace('_', ' ')}
                                </div>
                                {shipper.trackingUrlTemplate && (
                                    <div className="flex items-center gap-2 truncate">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        <span className="truncate" title={shipper.trackingUrlTemplate}>
                                            {shipper.trackingUrlTemplate}
                                        </span>
                                    </div>
                                )}
                                {shipper.contactDetails && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{shipper.contactDetails}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                <div className={`flex items-center gap-1.5 text-sm ${shipper.active ? 'text-green-600' : 'text-gray-400'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full ${shipper.active ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                    {shipper.active ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingShipper ? 'Edit Shipper' : 'Add New Shipper'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Fedex, Internal Fleet"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="INTERNAL">Internal</option>
                                        <option value="THIRD_PARTY">Third Party</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Level</label>
                                    <select
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                        value={formData.serviceLevel}
                                        onChange={(e) => setFormData({ ...formData, serviceLevel: e.target.value })}
                                    >
                                        <option value="STANDARD">Standard</option>
                                        <option value="NEXT_DAY">Next Day</option>
                                        <option value="SAME_DAY">Same Day</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking URL Template</label>
                                <Input
                                    value={formData.trackingUrlTemplate}
                                    onChange={(e) => setFormData({ ...formData, trackingUrlTemplate: e.target.value })}
                                    placeholder="https://tracker.com?id={ID}"
                                />
                                <p className="text-xs text-gray-500 mt-1">Optional. Use &#123;ID&#125; as placeholder.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details</label>
                                <Input
                                    value={formData.contactDetails}
                                    onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
                                    placeholder="Phone or Email"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    {editingShipper ? 'Save Changes' : 'Create Shipper'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
