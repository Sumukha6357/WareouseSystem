'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Building, MapPin, Navigation, Plus, Loader2, ChevronDown, ChevronRight, Box as BoxIcon, Trash2 } from 'lucide-react';

export default function WarehouseManagement() {
    const { user, refreshUser } = useAuth();
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({});

    // Form states
    const [isAddingRoom, setIsAddingRoom] = useState(false);
    const [addingBlockToRoomId, setAddingBlockToRoomId] = useState<string | null>(null);

    const [warehouseFormData, setWarehouseFormData] = useState({
        name: '', city: '', address: '', landmark: ''
    });

    const [roomName, setRoomName] = useState('');
    const [blockData, setBlockData] = useState({
        height: 0, length: 0, breath: 0, type: 'RECKED'
    });

    const toggleRoom = (roomId: string) => {
        setExpandedRooms(prev => ({ ...prev, [roomId]: !prev[roomId] }));
    };

    const handleCreateWarehouse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            await api.post(`/warehouses/${user.userId}`, warehouseFormData);
            await refreshUser();
            setIsCreating(false);
        } catch (error) {
            console.error('Failed to create warehouse', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.warehouse) return;
        setLoading(true);
        try {
            await api.post(`/rooms/${user.warehouse.warehouseId}`, { name: roomName });
            await refreshUser();
            setIsAddingRoom(false);
            setRoomName('');
        } catch (error) {
            console.error('Failed to add room', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addingBlockToRoomId) return;
        setLoading(true);
        try {
            await api.post(`/blocks/${addingBlockToRoomId}`, blockData);
            await refreshUser();
            setAddingBlockToRoomId(null);
            setBlockData({ height: 0, length: 0, breath: 0, type: 'RECKED' });
        } catch (error) {
            console.error('Failed to add block', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    if (!user.warehouse && !isCreating) {
        return (
            <div className="bg-white shadow rounded-lg p-8 text-center ring-1 ring-gray-200">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
                    <Building className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No Warehouse Registered</h3>
                <p className="mt-1 text-sm text-gray-500 mb-6">Start managing your inventory by registering your first warehouse.</p>
                <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Setup Warehouse
                </Button>
            </div>
        );
    }

    if (isCreating) {
        return (
            <div className="bg-white shadow rounded-lg p-6 ring-1 ring-gray-200 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-lg font-bold text-gray-900">Setup New Warehouse</h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>Cancel</Button>
                </div>
                <form onSubmit={handleCreateWarehouse} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Warehouse Name</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2.5"
                            value={warehouseFormData.name}
                            onChange={e => setWarehouseFormData({ ...warehouseFormData, name: e.target.value })}
                            placeholder="e.g. Central Logistics Hub"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">City</label>
                            <input
                                type="text"
                                required
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2.5"
                                value={warehouseFormData.city}
                                onChange={e => setWarehouseFormData({ ...warehouseFormData, city: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Landmark</label>
                            <input
                                type="text"
                                required
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2.5"
                                value={warehouseFormData.landmark}
                                onChange={e => setWarehouseFormData({ ...warehouseFormData, landmark: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Address</label>
                        <textarea
                            required
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2.5"
                            rows={3}
                            value={warehouseFormData.address}
                            onChange={e => setWarehouseFormData({ ...warehouseFormData, address: e.target.value })}
                        />
                    </div>
                    <div className="pt-2">
                        <Button type="submit" className="w-full justify-center py-6 text-base" isLoading={loading}>
                            Finalize Setup
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    const warehouse = user.warehouse!;

    return (
        <div className="space-y-6">
            {/* Warehouse Header */}
            <div className="bg-white shadow rounded-lg overflow-hidden ring-1 ring-gray-200">
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="p-2 bg-indigo-600 rounded-lg mr-3 shadow-md">
                            <Building className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{warehouse.name}</h3>
                            <p className="text-xs text-gray-500 font-medium lowercase flex items-center">
                                <MapPin className="h-3 w-3 mr-1" /> {warehouse.city}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsAddingRoom(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Room
                    </Button>
                </div>

                {/* Stats Summary */}
                <div className="px-6 py-4 grid grid-cols-2 gap-4 bg-gray-50/50 border-b">
                    <div className="flex items-center">
                        <div className="text-xl font-bold text-indigo-600 mr-2">{warehouse.rooms?.length || 0}</div>
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-tighter">Rooms</div>
                    </div>
                    <div className="flex items-center">
                        <div className="text-xl font-bold text-indigo-600 mr-2">
                            {warehouse.rooms?.reduce((acc, r) => acc + (r.blocks?.length || 0), 0) || 0}
                        </div>
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-tighter">Total Blocks</div>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="flex items-start text-sm text-gray-600">
                        <Navigation className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                        <span>{warehouse.address} (Near {warehouse.landmark})</span>
                    </div>
                </div>
            </div>

            {/* Hierarchy Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center">
                        Hierarchy Structure
                    </h4>
                </div>

                {isAddingRoom && (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 animate-in slide-in-from-top-2 duration-300">
                        <h5 className="text-sm font-bold text-indigo-900 mb-3">Add New Room</h5>
                        <form onSubmit={handleAddRoom} className="flex gap-2">
                            <input
                                type="text"
                                required
                                placeholder="Room Name (e.g. Cold Storage A)"
                                className="flex-1 rounded-md border-gray-300 text-sm"
                                value={roomName}
                                onChange={e => setRoomName(e.target.value)}
                            />
                            <Button type="submit" size="sm" isLoading={loading}>Add</Button>
                            <Button variant="ghost" size="sm" onClick={() => setIsAddingRoom(false)}>Cancel</Button>
                        </form>
                    </div>
                )}

                {warehouse.rooms && warehouse.rooms.length > 0 ? (
                    <div className="space-y-3">
                        {warehouse.rooms.map((room) => (
                            <div key={room.roomId} className="bg-white border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                                <div
                                    className="px-4 py-3 flex items-center justify-between cursor-pointer select-none"
                                    onClick={() => toggleRoom(room.roomId)}
                                >
                                    <div className="flex items-center gap-3">
                                        {expandedRooms[room.roomId] ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                                        <span className="font-semibold text-gray-800">{room.name}</span>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                                            {room.blocks?.length || 0} BLOCKS
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-indigo-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAddingBlockToRoomId(room.roomId);
                                        }}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {expandedRooms[room.roomId] && (
                                    <div className="px-4 pb-4 pt-1 space-y-2 border-t bg-gray-50/30 animate-in slide-in-from-top-1">
                                        {addingBlockToRoomId === room.roomId && (
                                            <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm mb-4">
                                                <h6 className="text-xs font-bold text-indigo-900 mb-3 uppercase tracking-wider">New Block Details</h6>
                                                <form onSubmit={handleAddBlock} className="space-y-3">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Height (m)</label>
                                                            <input type="number" step="0.1" required className="w-full text-xs rounded border-gray-300" value={blockData.height} onChange={e => setBlockData({ ...blockData, height: parseFloat(e.target.value) })} />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Length (m)</label>
                                                            <input type="number" step="0.1" required className="w-full text-xs rounded border-gray-300" value={blockData.length} onChange={e => setBlockData({ ...blockData, length: parseFloat(e.target.value) })} />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Breadth (m)</label>
                                                            <input type="number" step="0.1" required className="w-full text-xs rounded border-gray-300" value={blockData.breath} onChange={e => setBlockData({ ...blockData, breath: parseFloat(e.target.value) })} />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <select className="flex-1 text-xs rounded border-gray-300" value={blockData.type} onChange={e => setBlockData({ ...blockData, type: e.target.value })}>
                                                            <option value="RECKED">Recked (Shelved)</option>
                                                            <option value="UNRECKED">Unrecked (Floor Space)</option>
                                                        </select>
                                                        <Button type="submit" size="sm" className="h-8" isLoading={loading}>Create</Button>
                                                        <Button variant="ghost" size="sm" className="h-8" onClick={() => setAddingBlockToRoomId(null)}>Cancel</Button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}

                                        {room.blocks && room.blocks.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {room.blocks.map((block) => (
                                                    <div key={block.blockId} className="bg-white p-3 rounded-lg border text-xs flex items-center justify-between shadow-sm">
                                                        <div className="flex items-center">
                                                            <div className={`p-1.5 rounded mr-3 ${block.type === 'RECKED' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                                <BoxIcon className="h-3 w-3" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800">{block.type}</p>
                                                                <p className="text-gray-500 font-medium">H:{block.height}m L:{block.length}m B:{block.breath}m</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">#ID:{block.blockId.slice(0, 4)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] text-gray-400 text-center py-2 italic font-medium">No blocks configured for this room.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
                        <p className="text-sm text-gray-400 font-medium italic">Empty warehouse hierarchy. Start by adding a room.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
