'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Network, Search, Layers, Box as BoxIcon, Link as LinkIcon, Building, Package, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Room {
    roomId: string;
    name: string;
}

interface Block {
    blockId: string;
    height: number;
    length: number;
    breath: number;
    type: string;
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
    quantity: number;
    reservedQuantity: number;
    damagedQuantity: number;
    availableQuantity: number;
    isLowStock: boolean;
}

export default function HierarchyManagementView() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'rooms' | 'blocks'>('rooms');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [roomsRes, blocksRes, inventoriesRes] = await Promise.all([
                api.get('/rooms'),
                api.get('/blocks'),
                api.get('/inventory')
            ]);
            setRooms(roomsRes.data.data);
            setBlocks(blocksRes.data.data);
            setInventories(inventoriesRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch hierarchy data');
        } finally {
            setLoading(false);
        }
    };

    const handleRoomClick = (room: Room) => {
        setSelectedRoom(room);
        setView('blocks');
    };

    const handleBackToRooms = () => {
        setSelectedRoom(null);
        setView('rooms');
    };

    const filteredBlocks = selectedRoom
        ? blocks.filter(block => block.room?.roomId === selectedRoom.roomId)
        : blocks;

    const getBlockInventories = (blockId: string) => {
        return inventories.filter(inv => inv.blockId === blockId);
    };

    const getBlockCapacity = (block: Block) => {
        const totalCapacity = block.height * block.length * block.breath;
        const blockInventories = getBlockInventories(block.blockId);
        const occupied = blockInventories.reduce((sum, inv) => sum + inv.quantity, 0);
        const utilization = totalCapacity > 0 ? (occupied / totalCapacity) * 100 : 0;
        return { totalCapacity, occupied, utilization };
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="text-gray-500 font-medium">Mapping logistics topology...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                        {selectedRoom ? `${selectedRoom.name} - Blocks` : 'Topological Distribution'}
                    </h3>
                    <p className="text-sm font-medium text-gray-400">
                        {selectedRoom ? `Viewing blocks in ${selectedRoom.name}` : 'Global view of all storage nodes'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {selectedRoom && (
                        <Button variant="outline" size="sm" onClick={handleBackToRooms}>
                            ← Back to Rooms
                        </Button>
                    )}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => {
                                setView('rooms');
                                setSelectedRoom(null);
                            }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'rooms' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Rooms ({rooms.length})
                        </button>
                        <button
                            onClick={() => setView('blocks')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'blocks' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Blocks ({selectedRoom ? filteredBlocks.length : blocks.length})
                        </button>
                    </div>
                </div>
            </header>

            {view === 'rooms' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                        <div key={room.roomId} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer" onClick={() => handleRoomClick(room)}>
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Layers className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{room.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">{blocks.filter(b => b.room?.roomId === room.roomId).length} block(s) available</p>
                                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter mt-1">ID: {room.roomId.slice(0, 13)}...</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <LinkIcon className="h-4 w-4 text-indigo-600" />
                            </div>
                        </div>
                    ))}
                    {rooms.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-medium italic">No rooms mapped in the system</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBlocks.map((block) => {
                        const blockInventories = getBlockInventories(block.blockId);
                        const { totalCapacity, occupied, utilization } = getBlockCapacity(block);
                        const hasLowStock = blockInventories.some(inv => inv.isLowStock);

                        return (
                            <div
                                key={block.blockId}
                                className={`bg-white p-5 rounded-2xl border shadow-sm hover:shadow-xl transition-all ${hasLowStock ? 'border-amber-200 bg-amber-50/20' : 'border-gray-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg ${block.type === 'RECKED' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        <BoxIcon className="h-4 w-4" />
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        {hasLowStock && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${block.type === 'RECKED' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {block.type}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    {block.room && !selectedRoom && (
                                        <p className="text-xs font-semibold text-blue-600 mb-2 flex items-center gap-1">
                                            <Building className="h-3 w-3" />
                                            {block.room.name}
                                        </p>
                                    )}
                                    <p className="text-[10px] font-mono text-gray-400 mb-3">ID: {block.blockId.slice(0, 8)}</p>

                                    {/* Dimensions */}
                                    <div className="mt-2 grid grid-cols-3 gap-1 text-center mb-4">
                                        <div className="bg-gray-50 p-1 rounded">
                                            <p className="text-[8px] font-black text-gray-400 uppercase">H</p>
                                            <p className="text-xs font-bold text-gray-700">{block.height}m</p>
                                        </div>
                                        <div className="bg-gray-50 p-1 rounded">
                                            <p className="text-[8px] font-black text-gray-400 uppercase">L</p>
                                            <p className="text-xs font-bold text-gray-700">{block.length}m</p>
                                        </div>
                                        <div className="bg-gray-50 p-1 rounded">
                                            <p className="text-[8px] font-black text-gray-400 uppercase">B</p>
                                            <p className="text-xs font-bold text-gray-700">{block.breath}m</p>
                                        </div>
                                    </div>

                                    {/* Capacity Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-gray-500">Capacity</span>
                                            <span className="text-xs font-bold text-gray-900">
                                                {occupied.toFixed(0)} / {totalCapacity.toFixed(0)} m³
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${utilization > 80 ? 'bg-red-500' : utilization > 50 ? 'bg-amber-500' : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${Math.min(utilization, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{utilization.toFixed(1)}% utilized</p>
                                    </div>

                                    {/* Stored Products */}
                                    <div className="border-t border-gray-100 pt-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Package className="h-3 w-3 text-gray-400" />
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Products ({blockInventories.length})
                                            </span>
                                        </div>
                                        {blockInventories.length > 0 ? (
                                            <div className="space-y-2">
                                                {blockInventories.map((inv) => (
                                                    <div
                                                        key={inv.inventoryId}
                                                        className={`p-2 rounded-lg border text-xs ${inv.isLowStock ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-gray-900 truncate text-xs">
                                                                    {inv.product.name}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 font-mono">{inv.product.sku}</p>
                                                            </div>
                                                            <div className="text-right ml-2">
                                                                <p className="text-xs font-black text-gray-900">{inv.quantity}</p>
                                                                <p className="text-[10px] text-gray-400">total</p>
                                                            </div>
                                                        </div>

                                                        {/* Stock States - Enterprise Grade */}
                                                        <div className="grid grid-cols-3 gap-1 text-[10px]">
                                                            <div className="bg-green-50 border border-green-200 rounded px-1.5 py-1 text-center">
                                                                <p className="text-green-600 font-bold">{inv.availableQuantity}</p>
                                                                <p className="text-green-500">Available</p>
                                                            </div>
                                                            <div className="bg-orange-50 border border-orange-200 rounded px-1.5 py-1 text-center">
                                                                <p className="text-orange-600 font-bold">{inv.reservedQuantity || 0}</p>
                                                                <p className="text-orange-500">Reserved</p>
                                                            </div>
                                                            <div className="bg-red-50 border border-red-200 rounded px-1.5 py-1 text-center">
                                                                <p className="text-red-600 font-bold">{inv.damagedQuantity || 0}</p>
                                                                <p className="text-red-500">Damaged</p>
                                                            </div>
                                                        </div>

                                                        {inv.isLowStock && (
                                                            <p className="text-[10px] text-amber-600 font-bold mt-1">⚠️ Low Stock</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-3 bg-gray-50 rounded-lg">
                                                <Package className="h-5 w-5 text-gray-300 mx-auto mb-1" />
                                                <p className="text-[10px] text-gray-400">No products stored</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filteredBlocks.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-medium italic">
                                {selectedRoom ? `No blocks found in ${selectedRoom.name}` : 'No storage blocks found'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
