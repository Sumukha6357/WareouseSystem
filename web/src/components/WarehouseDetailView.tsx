'use client';

import React, { useCallback, useEffect, useState } from 'react';
import httpClient from '@/lib/httpClient';
import { notify } from '@/lib/notify';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    MapPin,
    Navigation,
    Plus,
    ChevronRight,
    Box as BoxIcon,
    ArrowLeft,
    Trash2,
    Layers,
    X,
    Settings2,
    Maximize2,
    Layout,
    BoxSelect,
    Cpu,
    Activity,
    Warehouse as WarehouseIcon
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { FormField } from './ui/FormField';
import { Card, CardHeader, CardContent } from './ui/Card';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorState from './ui/ErrorState';



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

    // Modals state
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [addingBlockToRoomId, setAddingBlockToRoomId] = useState<string | null>(null);

    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
    const [editingBlock, setEditingBlock] = useState<Block | null>(null);
    const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);

    const [roomName, setRoomName] = useState('');
    const [blockData, setBlockData] = useState({
        height: 0, length: 0, breath: 0, type: 'RECKED'
    });

    const fetchWarehouse = useCallback(async () => {
        try {
            const data = await httpClient.get<Warehouse>(`/warehouses/${warehouseId}`);
            setWarehouse(data);
        } catch {
            notify.error('Failed to fetch warehouse details');
        } finally {
            setLoading(false);
        }
    }, [warehouseId]);

    useEffect(() => {
        fetchWarehouse();
    }, [fetchWarehouse]);

    const toggleRoom = (roomId: string) => {
        setExpandedRooms(prev => ({ ...prev, [roomId]: !prev[roomId] }));
    };

    const handleAddRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!warehouse) return;
        setLoading(true);
        try {
            await httpClient.post(`/rooms/${warehouse.warehouseId}`, { name: roomName });
            notify.success('Storage room registered');
            await fetchWarehouse();
            setShowRoomModal(false);
            setRoomName('');
        } catch {
            notify.error('Failed to register room');
        } finally {
            setLoading(false);
        }
    };

    const handleAddBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addingBlockToRoomId) return;
        setLoading(true);
        try {
            await httpClient.post(`/blocks/${addingBlockToRoomId}`, blockData);
            notify.success('Terminal block deployed');
            await fetchWarehouse();
            setShowBlockModal(false);
            setAddingBlockToRoomId(null);
            resetBlockForm();
        } catch {
            notify.error('Failed to deploy block');
        } finally {
            setLoading(false);
        }
    };

    const handleEditRoom = (room: Room) => {
        setEditingRoom(room);
        setRoomName(room.name);
        setShowRoomModal(true);
    };

    const handleUpdateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRoom) return;
        setLoading(true);
        try {
            await httpClient.put(`/rooms/${editingRoom.roomId}`, { name: roomName });
            notify.success('Room parameters updated');
            await fetchWarehouse();
            setEditingRoom(null);
            setShowRoomModal(false);
            setRoomName('');
        } catch {
            notify.error('Failed to update room');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoom = async (roomId: string) => {
        setLoading(true);
        try {
            await httpClient.delete(`/rooms/${roomId}`);
            notify.success('Room purged from registry');
            await fetchWarehouse();
            setDeletingRoomId(null);
        } catch {
            notify.error('Failed to purge room');
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
        setShowBlockModal(true);
    };

    const handleUpdateBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBlock) return;
        setLoading(true);
        try {
            await httpClient.put(`/blocks/${editingBlock.blockId}`, blockData);
            notify.success('Block vector adjusted');
            await fetchWarehouse();
            setEditingBlock(null);
            setShowBlockModal(false);
            resetBlockForm();
        } catch {
            notify.error('Failed to adjust block');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlock = async (blockId: string) => {
        setLoading(true);
        try {
            await httpClient.delete(`/blocks/${blockId}`);
            notify.success('Block decommissioned');
            await fetchWarehouse();
            setDeletingBlockId(null);
        } catch {
            notify.error('Failed to decommission block');
        } finally {
            setLoading(false);
        }
    };

    const resetBlockForm = () => {
        setBlockData({ height: 0, length: 0, breath: 0, type: 'RECKED' });
    };

    if (loading || !warehouse) {
        return <LoadingSpinner message="Synchronizing storage matrix..." />;
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header with Back Button */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex items-center gap-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onBack}
                        className="h-14 w-14 rounded-2xl shadow-lg border-card-border/50 bg-card hover:border-primary/30 group"
                    >
                        <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4 italic uppercase">
                            Node Inspection
                        </h1>
                        <p className="text-sm font-medium text-muted mt-2">Precision storage hierarchy and terminal management.</p>
                    </div>
                </div>
            </header>

            {/* Warehouse Info Card */}
            <Card className="overflow-hidden group/card border-primary/10">
                <CardHeader className="p-10 border-b-2 border-card-border/30 bg-gradient-to-br from-primary/5 via-transparent to-transparent flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div className="flex items-center gap-8">
                        <div className="p-8 bg-primary rounded-[2rem] shadow-2xl shadow-primary/30 group-hover/card:scale-105 group-hover/card:rotate-3 transition-transform duration-500">
                            <WarehouseIcon className="h-12 w-12 text-white" />
                        </div>
                        <div>
                            <h2 className="text-5xl font-black text-sharp tracking-tighter italic uppercase">{warehouse.name}</h2>
                            <div className="flex items-center gap-4 mt-4">
                                <Badge variant="primary" className="h-8 px-4">
                                    <MapPin size={14} className="mr-2 opacity-50" />
                                    {warehouse.city}
                                </Badge>
                                <Badge variant="success" className="h-8 px-4">
                                    <Activity size={14} className="mr-2 animate-pulse" />
                                    Active Link
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-background/50 rounded-[2.5rem] border-2 border-card-border/30 shadow-inner">
                        <div className="px-10 py-6 text-center border-r-2 border-card-border/30 last:border-0">
                            <div className="text-5xl font-black text-sharp tracking-tighter italic">{warehouse.rooms?.length || 0}</div>
                            <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-2 leading-none">Rooms</div>
                        </div>
                        <div className="px-10 py-6 text-center">
                            <div className="text-5xl font-black text-primary tracking-tighter italic">
                                {warehouse.rooms?.reduce((acc, r) => acc + (r.blocks?.length || 0), 0) || 0}
                            </div>
                            <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-2 leading-none">Terminals</div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-10 py-10 flex flex-col md:flex-row gap-8">
                    <div className="flex items-start gap-4 flex-1 p-6 bg-background/50 rounded-3xl border border-card-border/30 group/item hover:border-primary/20 transition-colors">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0 group-hover/item:scale-110 transition-transform">
                            <Navigation className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-muted">Precision Vector</p>
                            <p className="font-black text-sharp text-base leading-relaxed italic truncate tracking-tight">{warehouse.address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 flex-1 p-6 bg-background/50 rounded-3xl border border-card-border/30 group/item hover:border-primary/20 transition-colors">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0 group-hover/item:scale-110 transition-transform">
                            <Layout className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-muted">Auxiliary Reference</p>
                            <p className="font-black text-sharp text-base italic leading-relaxed truncate tracking-tight">Near {warehouse.landmark}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rooms & Blocks Section */}
            <div className="space-y-8">
                <div className="flex justify-between items-center bg-card/50 p-6 rounded-[2rem] border-2 border-card-border/30 backdrop-blur-sm">
                    <div>
                        <h3 className="text-2xl font-black text-sharp tracking-tighter flex items-center gap-4">
                            <Layers className="h-8 w-8 text-primary" />
                            Storage Matrix
                        </h3>
                    </div>
                    <Button
                        onClick={() => setShowRoomModal(true)}
                        className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                    >
                        <Plus className="mr-2" />
                        Append Room
                    </Button>
                </div>

                {warehouse.rooms && warehouse.rooms.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8">
                        {warehouse.rooms.map((room) => (
                            <div
                                key={room.roomId}
                                className={`bg-card rounded-[3rem] border-2 transition-all duration-500 overflow-hidden relative ${expandedRooms[room.roomId] ? 'border-primary/40 shadow-2xl shadow-primary/10' : 'border-card-border shadow-sm hover:shadow-xl'}`}
                            >
                                {deletingRoomId === room.roomId && (
                                    <div className="absolute inset-0 bg-background/95 backdrop-blur-md z-[50] flex flex-col items-center justify-center p-12 gap-8 animate-in fade-in zoom-in-95 text-center">
                                        <div className="p-8 bg-red-500/10 rounded-[2rem] text-red-500 border-2 border-red-500/20 shadow-2xl shadow-red-500/10">
                                            <Trash2 size={48} />
                                        </div>
                                        <div>
                                            <h4 className="text-3xl font-black text-sharp uppercase tracking-tighter mb-4 italic">Purge Storage Room?</h4>
                                            <p className="text-sm text-muted font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                                                Warning: All terminal nodes associated with <span className="text-sharp italic">&quot;{room.name}&quot;</span> will be permanently erased.
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                            <Button size="lg" className="flex-1 bg-red-600 hover:bg-red-700 h-16 shadow-xl shadow-red-500/20 border-none" onClick={() => handleDeleteRoom(room.roomId)} isLoading={loading}>
                                                Confirm Purge
                                            </Button>
                                            <Button variant="ghost" size="lg" className="flex-1 h-16" onClick={() => setDeletingRoomId(null)}>
                                                Stand Down
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between cursor-pointer select-none gap-8 transition-colors ${expandedRooms[room.roomId] ? 'bg-primary/[0.03]' : 'hover:bg-primary/[0.03]'}`}
                                    onClick={() => toggleRoom(room.roomId)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${expandedRooms[room.roomId] ? 'bg-primary text-white rotate-90 scale-110' : 'bg-background border-2 border-card-border text-muted group-hover:text-primary'}`}>
                                            <ChevronRight className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-5">
                                                <h3 className="font-black text-sharp text-4xl tracking-tighter italic uppercase">{room.name}</h3>
                                                <Badge variant="secondary" className="h-7 px-4">
                                                    {room.blocks?.length || 0} TERMINAL NODES
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full lg:w-auto" onClick={e => e.stopPropagation()}>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl border-card-border/50 bg-card hover:border-primary/30 hover:text-primary transition-all shadow-md"
                                            onClick={() => handleEditRoom(room)}
                                        >
                                            <Settings2 size={20} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl border-card-border/50 bg-card hover:border-red-500/30 hover:text-red-500 transition-all shadow-md"
                                            onClick={() => setDeletingRoomId(room.roomId)}
                                        >
                                            <Trash2 size={20} />
                                        </Button>
                                        <div className="h-10 w-[2px] bg-card-border/30 mx-3 hidden lg:block" />
                                        <Button
                                            className="flex-1 lg:flex-none h-12 px-8 rounded-xl shadow-xl shadow-primary/20"
                                            onClick={() => {
                                                setAddingBlockToRoomId(room.roomId);
                                                setShowBlockModal(true);
                                            }}
                                        >
                                            <Plus className="mr-2 h-5 w-5" />
                                            Spawn Block
                                        </Button>
                                    </div>
                                </div>

                                {expandedRooms[room.roomId] && (
                                    <div className="px-10 pb-12 pt-4 space-y-10 animate-in slide-in-from-top-6 duration-700">
                                        <div className="h-[2px] bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />

                                        {room.blocks && room.blocks.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                                {room.blocks.map((block) => (
                                                    <div key={block.blockId} className="bg-background/40 backdrop-blur-sm rounded-[3rem] p-8 border-2 border-card-border/40 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all relative group/block">
                                                        {deletingBlockId === block.blockId && (
                                                            <div className="absolute inset-0 bg-background/95 backdrop-blur-md rounded-[3rem] z-20 flex flex-col items-center justify-center p-8 gap-6 animate-in fade-in">
                                                                <p className="text-[10px] font-black text-sharp text-center uppercase tracking-[0.3em] leading-relaxed italic">Sever Block Link?</p>
                                                                <div className="flex gap-3 w-full">
                                                                    <Button size="sm" className="flex-1 bg-red-600 h-10 shadow-lg shadow-red-600/20 border-none" onClick={() => handleDeleteBlock(block.blockId)} isLoading={loading}>
                                                                        Confirm
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" className="flex-1 h-10" onClick={() => setDeletingBlockId(null)}>
                                                                        Abort
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-start mb-8">
                                                            <div className={`p-5 rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-500 group-hover/block:rotate-12 group-hover/block:scale-110 ${block.type === 'RECKED' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                                                <BoxIcon className="h-7 w-7" />
                                                            </div>
                                                            <div className="flex gap-2 opacity-0 group-hover/block:opacity-100 translate-x-4 group-hover/block:translate-x-0 transition-all duration-300">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() => handleEditBlock(block)}
                                                                    className="h-10 w-10 rounded-xl bg-card border-card-border/50 hover:border-primary/30 hover:text-primary shadow-lg"
                                                                >
                                                                    <Settings2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() => setDeletingBlockId(block.blockId)}
                                                                    className="h-10 w-10 rounded-xl bg-card border-card-border/50 hover:border-red-500/30 hover:text-red-500 shadow-lg"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-8">
                                                            <div className="p-4 bg-background/50 rounded-2xl border border-card-border/30">
                                                                <p className="text-[9px] font-black text-muted uppercase tracking-[0.4em] font-mono mb-2 leading-none">NODE_SIGNATURE</p>
                                                                <p className="text-xs font-black text-sharp tracking-tight truncate font-mono opacity-80 uppercase">{block.blockId}</p>
                                                            </div>

                                                            <Badge variant={block.type === 'RECKED' ? 'warning' : 'primary'} className="h-7 px-4 w-full justify-center">
                                                                {block.type === 'RECKED' ? 'SHELVED_ASSET' : 'FLOOR_ALLOCATION'}
                                                            </Badge>

                                                            <div className="grid grid-cols-3 gap-3">
                                                                <div className="bg-background/60 p-3 rounded-2xl border border-card-border/30 text-center group/vector hover:border-primary/20 transition-colors">
                                                                    <p className="text-[8px] font-black text-muted uppercase mb-1 tracking-widest">H</p>
                                                                    <p className="text-sm font-black text-sharp tabular-nums italic">{block.height}m</p>
                                                                </div>
                                                                <div className="bg-background/60 p-3 rounded-2xl border border-card-border/30 text-center group/vector hover:border-primary/20 transition-colors">
                                                                    <p className="text-[8px] font-black text-muted uppercase mb-1 tracking-widest">L</p>
                                                                    <p className="text-sm font-black text-sharp tabular-nums italic">{block.length}m</p>
                                                                </div>
                                                                <div className="bg-background/60 p-3 rounded-2xl border border-card-border/30 text-center group/vector hover:border-primary/20 transition-colors">
                                                                    <p className="text-[8px] font-black text-muted uppercase mb-1 tracking-widest">B</p>
                                                                    <p className="text-sm font-black text-sharp tabular-nums italic">{block.breath}m</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-24 bg-background/30 rounded-[3rem] border-4 border-dashed border-card-border/40 text-center group/void hover:border-primary/20 transition-colors">
                                                <Cpu className="h-20 w-20 text-muted/10 mx-auto mb-6 group-hover/void:scale-110 group-hover/void:text-primary/5 transition-all duration-700" />
                                                <p className="text-muted font-black uppercase tracking-[0.4em] text-xs">Matrix Layer Null</p>
                                                <p className="text-[10px] text-muted/30 mt-4 font-bold uppercase tracking-[0.2em] italic">No storage components detected at this level.</p>
                                                <Button variant="ghost" className="mt-8 text-[10px] shadow-none" onClick={() => { setAddingBlockToRoomId(room.roomId); setShowBlockModal(true); }}>
                                                    Initialize First Block
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-60 border-4 border-dashed border-card-border/30 rounded-[5rem] text-center bg-card/10 backdrop-blur-sm group/void hover:border-primary/20 transition-all duration-700">
                        <BoxSelect className="h-40 w-40 text-muted/5 mx-auto mb-10 group-hover/void:scale-110 group-hover/void:text-primary/5 transition-all duration-1000" />
                        <h4 className="text-3xl font-black text-muted/40 uppercase tracking-[0.5em] italic">Storage Void</h4>
                        <p className="text-sm text-muted/30 mt-8 font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                            The warehouse matrix has no initialized partitions. Commence room registration to define the storage hierarchy.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            className="mt-12 px-12 shadow-2xl shadow-primary/20"
                            onClick={() => setShowRoomModal(true)}
                        >
                            <Plus className="mr-3 h-5 w-5" />
                            Executive Partitioning
                        </Button>
                    </div>
                )}
            </div>

            {/* Room Modal */}
            <Modal
                isOpen={showRoomModal}
                onClose={() => {
                    setShowRoomModal(false);
                    setEditingRoom(null);
                    setRoomName('');
                }}
                title={editingRoom ? 'Partition Configuration' : 'Sector Initialization'}
                maxWidth="md"
            >
                <form onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom} className="space-y-10">
                    <FormField
                        label="Partition Designation"
                        required
                        placeholder="e.g. COLD_STORAGE_A"
                        value={roomName}
                        onChange={e => setRoomName(e.target.value)}
                        className="text-xl font-black italic uppercase"
                    />

                    <div className="flex flex-col gap-3 pt-10 border-t border-card-border/30">
                        <Button
                            type="submit"
                            className="w-full py-7 shadow-2xl shadow-primary/30"
                            isLoading={loading}
                        >
                            {editingRoom ? 'Commit Specification' : 'Finalize Registration'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => {
                                setShowRoomModal(false);
                                setEditingRoom(null);
                                setRoomName('');
                            }}
                        >
                            Abort Protocol
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Block Modal */}
            <Modal
                isOpen={showBlockModal}
                onClose={() => {
                    setShowBlockModal(false);
                    setEditingBlock(null);
                    setAddingBlockToRoomId(null);
                    resetBlockForm();
                }}
                title={editingBlock ? 'Block Alignment' : 'Terminal Spawning'}
                maxWidth="lg"
            >
                <form onSubmit={editingBlock ? handleUpdateBlock : handleAddBlock} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FormField
                            label="Vertical Vector (m)"
                            type="number"
                            step="0.1"
                            required
                            placeholder="0.0"
                            value={blockData.height || ''}
                            onChange={e => setBlockData({ ...blockData, height: parseFloat(e.target.value) || 0 })}
                            className="font-black text-lg italic"
                        />
                        <FormField
                            label="Longitude Vector (m)"
                            type="number"
                            step="0.1"
                            required
                            placeholder="0.0"
                            value={blockData.length || ''}
                            onChange={e => setBlockData({ ...blockData, length: parseFloat(e.target.value) || 0 })}
                            className="font-black text-lg italic"
                        />
                        <FormField
                            label="Breadth Vector (m)"
                            type="number"
                            step="0.1"
                            required
                            placeholder="0.0"
                            value={blockData.breath || ''}
                            onChange={e => setBlockData({ ...blockData, breath: parseFloat(e.target.value) || 0 })}
                            className="font-black text-lg italic"
                        />
                    </div>

                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2 leading-none">Operational Tier Configuration</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <button
                                type="button"
                                onClick={() => setBlockData({ ...blockData, type: 'RECKED' })}
                                className={`p-8 rounded-[2.5rem] border-2 transition-all flex items-center gap-6 group/opt ${blockData.type === 'RECKED' ? 'border-primary bg-primary/[0.03] shadow-inner' : 'border-card-border hover:border-primary/20'}`}
                            >
                                <div className={`p-4 rounded-2xl shadow-lg transition-transform duration-500 group-hover/opt:rotate-6 ${blockData.type === 'RECKED' ? 'bg-primary text-white shadow-primary/20' : 'bg-background border border-card-border text-muted group-hover/opt:text-primary'}`}>
                                    <Layers className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-sharp uppercase italic">Shelved_Reck</p>
                                    <p className="text-[10px] text-muted mt-1 uppercase font-bold tracking-widest opacity-60">Standard stacking logic</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setBlockData({ ...blockData, type: 'UNRECKED' })}
                                className={`p-8 rounded-[2.5rem] border-2 transition-all flex items-center gap-6 group/opt ${blockData.type === 'UNRECKED' ? 'border-primary bg-primary/[0.03] shadow-inner' : 'border-card-border hover:border-primary/20'}`}
                            >
                                <div className={`p-4 rounded-2xl shadow-lg transition-transform duration-500 group-hover/opt:rotate-6 ${blockData.type === 'UNRECKED' ? 'bg-primary text-white shadow-primary/20' : 'bg-background border border-card-border text-muted group-hover/opt:text-primary'}`}>
                                    <Maximize2 className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-sharp uppercase italic">Floor_Max</p>
                                    <p className="text-[10px] text-muted mt-1 uppercase font-bold tracking-widest opacity-60">Raw volumetric allocation</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-10 border-t border-card-border/30">
                        <Button
                            type="submit"
                            className="w-full py-7 shadow-2xl shadow-primary/30"
                            isLoading={loading}
                        >
                            {editingBlock ? 'Commit Vector shift' : 'Initiate Spawning'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => {
                                setShowBlockModal(false);
                                setEditingBlock(null);
                                setAddingBlockToRoomId(null);
                                resetBlockForm();
                            }}
                        >
                            Abort Cycle
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
