'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import {
    Building2,
    MapPin,
    Navigation,
    Plus,
    ChevronDown,
    ChevronRight,
    Box as BoxIcon,
    ArrowLeft,
    Edit2,
    Trash2,
    Layers
} from 'lucide-react';

interface Block {
    blockId: string;
    height: number;
    length: number;
    breath: number;
    type: string;
}

interface Room {
    roomId: string;
    name: string;
    blocks?: Block[];
}

interface Warehouse {
    warehouseId: string;
    name: string;
    city: string;
    address: string;
    landmark: string;
    rooms?: Room[];
}

interface WarehouseDetailViewProps {
    warehouseId: string;
    onBack: () => void;
}

export default function WarehouseDetailView({ warehouseId, onBack }: WarehouseDetailViewProps) {
    const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({});
    const [isAddingRoom, setIsAddingRoom] = useState(false);
    const [addingBlockToRoomId, setAddingBlockToRoomId] = useState<string | null>(null);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
    const [editingBlock, setEditingBlock] = useState<Block | null>(null);
    const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);
    const [roomName, setRoomName] = useState('');
    const [blockData, setBlockData] = useState({
        height: 0, length: 0, breath: 0, type: 'RECKED'
    });

    useEffect(() => {
        fetchWarehouse();
    }, [warehouseId]);

    const fetchWarehouse = async () => {
        try {
            const response = await api.get(`/warehouses/${warehouseId}`);
            setWarehouse(response.data.data);
        } catch (error) {
            console.error('Failed to fetch warehouse', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRoom = (roomId: string) => {
        setExpandedRooms(prev => ({ ...prev, [roomId]: !prev[roomId] }));
    };

    const handleAddRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!warehouse) return;
        setLoading(true);
        try {
            await api.post(`/rooms/${warehouse.warehouseId}`, { name: roomName });
            await fetchWarehouse();
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
            await fetchWarehouse();
            setAddingBlockToRoomId(null);
            setBlockData({ height: 0, length: 0, breath: 0, type: 'RECKED' });
        } catch (error) {
            console.error('Failed to add block', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditRoom = (room: Room) => {
        setEditingRoom(room);
        setRoomName(room.name);
    };

    const handleUpdateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRoom) return;
        setLoading(true);
        try {
            await api.put(`/rooms/${editingRoom.roomId}`, { name: roomName });
            await fetchWarehouse();
            setEditingRoom(null);
            setRoomName('');
        } catch (error) {
            console.error('Failed to update room', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoom = async (roomId: string) => {
        setLoading(true);
        try {
            await api.delete(`/rooms/${roomId}`);
            await fetchWarehouse();
            setDeletingRoomId(null);
        } catch (error) {
            console.error('Failed to delete room', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditBlock = (block: Block) => {
        setEditingBlock(block);
        setBlockData({
            height: block.height,
            length: block.length,
            breath: block.breath,
            type: block.type
        });
    };

    const handleUpdateBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBlock) return;
        setLoading(true);
        try {
            await api.put(`/blocks/${editingBlock.blockId}`, blockData);
            await fetchWarehouse();
            setEditingBlock(null);
            setBlockData({ height: 0, length: 0, breath: 0, type: 'RECKED' });
        } catch (error) {
            console.error('Failed to update block', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlock = async (blockId: string) => {
        setLoading(true);
        try {
            await api.delete(`/blocks/${blockId}`);
            await fetchWarehouse();
            setDeletingBlockId(null);
        } catch (error) {
            console.error('Failed to delete block', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !warehouse) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="text-gray-500 font-medium">Loading warehouse details...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to List
                </Button>
            </div>

            {/* Warehouse Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{warehouse.name}</h2>
                                <div className="flex items-center gap-2 mt-2 text-gray-500">
                                    <MapPin className="h-4 w-4" />
                                    <span className="font-medium">{warehouse.city}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="px-8 py-6 grid grid-cols-3 gap-6 bg-gray-50/50 border-b border-gray-100">
                    <div className="text-center">
                        <div className="text-3xl font-black text-indigo-600">{warehouse.rooms?.length || 0}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Rooms</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-indigo-600">
                            {warehouse.rooms?.reduce((acc, r) => acc + (r.blocks?.length || 0), 0) || 0}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total Blocks</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-emerald-600">Active</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Status</div>
                    </div>
                </div>

                {/* Address */}
                <div className="px-8 py-6">
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                        <Navigation className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium">{warehouse.address}</p>
                            <p className="text-gray-400 mt-1">Near {warehouse.landmark}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rooms & Blocks Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <Layers className="h-5 w-5 text-indigo-600" />
                        Storage Hierarchy
                    </h3>
                    <Button onClick={() => setIsAddingRoom(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Room
                    </Button>
                </div>

                {(isAddingRoom || editingRoom) && (
                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 animate-in slide-in-from-top-2 duration-300">
                        <h5 className="text-sm font-bold text-indigo-900 mb-4">{editingRoom ? 'Edit Room' : 'Create New Room'}</h5>
                        <form onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom} className="flex gap-3">
                            <input
                                type="text"
                                required
                                placeholder="Room Name (e.g. Cold Storage A)"
                                className="flex-1 rounded-xl border-gray-300 text-sm py-3 px-4"
                                value={roomName}
                                onChange={e => setRoomName(e.target.value)}
                            />
                            <Button type="submit" isLoading={loading}>{editingRoom ? 'Update' : 'Create'}</Button>
                            <Button variant="outline" onClick={() => {
                                setIsAddingRoom(false);
                                setEditingRoom(null);
                                setRoomName('');
                            }}>Cancel</Button>
                        </form>
                    </div>
                )}

                {warehouse.rooms && warehouse.rooms.length > 0 ? (
                    <div className="space-y-3">
                        {warehouse.rooms.map((room) => (
                            <div key={room.roomId} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all relative">
                                {/* Delete Confirmation Overlay for Room */}
                                {deletingRoomId === room.roomId && (
                                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-20 flex flex-col items-center justify-center p-6 gap-4">
                                        <p className="text-sm font-bold text-gray-900 text-center">Delete this room and all its blocks?</p>
                                        <p className="text-xs text-gray-500 text-center">This action cannot be undone.</p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => setDeletingRoomId(null)}>
                                                Cancel
                                            </Button>
                                            <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteRoom(room.roomId)} isLoading={loading}>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div
                                    className="px-6 py-4 flex items-center justify-between cursor-pointer select-none hover:bg-gray-50"
                                    onClick={() => toggleRoom(room.roomId)}
                                >
                                    <div className="flex items-center gap-4">
                                        {expandedRooms[room.roomId] ?
                                            <ChevronDown className="h-5 w-5 text-gray-400" /> :
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        }
                                        <span className="font-bold text-gray-900 text-lg">{room.name}</span>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold">
                                            {room.blocks?.length || 0} BLOCKS
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditRoom(room);
                                            }}
                                            className="p-2 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                                            title="Edit room"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeletingRoomId(room.roomId);
                                            }}
                                            className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete room"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setAddingBlockToRoomId(room.roomId);
                                            }}
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Block
                                        </Button>
                                    </div>
                                </div>

                                {expandedRooms[room.roomId] && (
                                    <div className="px-6 pb-6 pt-2 space-y-4 border-t bg-gray-50/30 animate-in slide-in-from-top-1">
                                        {(addingBlockToRoomId === room.roomId || (editingBlock && room.blocks?.some(b => b.blockId === editingBlock.blockId))) && (
                                            <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                                                <h6 className="text-xs font-black text-indigo-900 mb-4 uppercase tracking-wider">
                                                    {editingBlock ? 'Edit Block Configuration' : 'New Block Configuration'}
                                                </h6>
                                                <form onSubmit={editingBlock ? handleUpdateBlock : handleAddBlock} className="space-y-4">
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="text-xs uppercase font-bold text-gray-400 block mb-2">Height (m)</label>
                                                            <input
                                                                type="number"
                                                                step="0.1"
                                                                required
                                                                className="w-full text-sm rounded-lg border-gray-300 py-2"
                                                                value={blockData.height}
                                                                onChange={e => setBlockData({ ...blockData, height: parseFloat(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs uppercase font-bold text-gray-400 block mb-2">Length (m)</label>
                                                            <input
                                                                type="number"
                                                                step="0.1"
                                                                required
                                                                className="w-full text-sm rounded-lg border-gray-300 py-2"
                                                                value={blockData.length}
                                                                onChange={e => setBlockData({ ...blockData, length: parseFloat(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs uppercase font-bold text-gray-400 block mb-2">Breadth (m)</label>
                                                            <input
                                                                type="number"
                                                                step="0.1"
                                                                required
                                                                className="w-full text-sm rounded-lg border-gray-300 py-2"
                                                                value={blockData.breath}
                                                                onChange={e => setBlockData({ ...blockData, breath: parseFloat(e.target.value) })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <select
                                                            className="flex-1 text-sm rounded-lg border-gray-300 py-2"
                                                            value={blockData.type}
                                                            onChange={e => setBlockData({ ...blockData, type: e.target.value })}
                                                        >
                                                            <option value="RECKED">Recked (Shelved)</option>
                                                            <option value="UNRECKED">Unrecked (Floor Space)</option>
                                                        </select>
                                                        <Button type="submit" isLoading={loading}>{editingBlock ? 'Update Block' : 'Create Block'}</Button>
                                                        <Button variant="outline" onClick={() => {
                                                            setAddingBlockToRoomId(null);
                                                            setEditingBlock(null);
                                                            setBlockData({ height: 0, length: 0, breath: 0, type: 'RECKED' });
                                                        }}>Cancel</Button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}

                                        {room.blocks && room.blocks.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {room.blocks.map((block) => (
                                                    <div key={block.blockId} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
                                                        {/* Delete Confirmation Overlay for Block */}
                                                        {deletingBlockId === block.blockId && (
                                                            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center p-4 gap-3">
                                                                <p className="text-xs font-bold text-gray-900 text-center">Delete this block?</p>
                                                                <div className="flex gap-2">
                                                                    <Button variant="outline" size="sm" onClick={() => setDeletingBlockId(null)}>
                                                                        Cancel
                                                                    </Button>
                                                                    <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteBlock(block.blockId)} isLoading={loading}>
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className={`p-2 rounded-lg ${block.type === 'RECKED' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                                <BoxIcon className="h-4 w-4" />
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={() => handleEditBlock(block)}
                                                                    className="p-1.5 hover:bg-indigo-50 rounded text-gray-400 hover:text-indigo-600 transition-colors"
                                                                    title="Edit block"
                                                                >
                                                                    <Edit2 className="h-3 w-3" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeletingBlockId(block.blockId)}
                                                                    className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"
                                                                    title="Delete block"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-mono text-gray-400">ID: {block.blockId.slice(0, 8)}</p>
                                                            <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase inline-block ${block.type === 'RECKED' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                                {block.type}
                                                            </span>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                <div className="bg-gray-50 p-2 rounded text-center">
                                                                    <p className="text-[8px] font-black text-gray-400 uppercase">H</p>
                                                                    <p className="text-sm font-bold text-gray-700">{block.height}m</p>
                                                                </div>
                                                                <div className="bg-gray-50 p-2 rounded text-center">
                                                                    <p className="text-[8px] font-black text-gray-400 uppercase">L</p>
                                                                    <p className="text-sm font-bold text-gray-700">{block.length}m</p>
                                                                </div>
                                                                <div className="bg-gray-50 p-2 rounded text-center">
                                                                    <p className="text-[8px] font-black text-gray-400 uppercase">B</p>
                                                                    <p className="text-sm font-bold text-gray-700">{block.breath}m</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 text-center py-8 italic">No blocks configured for this room.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
                        <p className="text-gray-400 font-medium italic">No rooms created yet. Start by adding a room.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
