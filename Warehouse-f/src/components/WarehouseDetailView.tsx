'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    Building2,
    MapPin,
    Navigation,
    Plus,
    ChevronDown,
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
import toast from 'react-hot-toast';

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

    useEffect(() => {
        fetchWarehouse();
    }, [warehouseId]);

    const fetchWarehouse = async () => {
        try {
            const response = await api.get(`/warehouses/${warehouseId}`);
            setWarehouse(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch warehouse details');
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
            toast.success('Storage room registered');
            await fetchWarehouse();
            setShowRoomModal(false);
            setRoomName('');
        } catch (error) {
            toast.error('Failed to register room');
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
            toast.success('Terminal block deployed');
            await fetchWarehouse();
            setShowBlockModal(false);
            setAddingBlockToRoomId(null);
            resetBlockForm();
        } catch (error) {
            toast.error('Failed to deploy block');
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
            await api.put(`/rooms/${editingRoom.roomId}`, { name: roomName });
            toast.success('Room parameters updated');
            await fetchWarehouse();
            setEditingRoom(null);
            setShowRoomModal(false);
            setRoomName('');
        } catch (error) {
            toast.error('Failed to update room');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoom = async (roomId: string) => {
        setLoading(true);
        try {
            await api.delete(`/rooms/${roomId}`);
            toast.success('Room purged from registry');
            await fetchWarehouse();
            setDeletingRoomId(null);
        } catch (error) {
            toast.error('Failed to purge room');
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
            await api.put(`/blocks/${editingBlock.blockId}`, blockData);
            toast.success('Block vector adjusted');
            await fetchWarehouse();
            setEditingBlock(null);
            setShowBlockModal(false);
            resetBlockForm();
        } catch (error) {
            toast.error('Failed to adjust block');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlock = async (blockId: string) => {
        setLoading(true);
        try {
            await api.delete(`/blocks/${blockId}`);
            toast.success('Block decommissioned');
            await fetchWarehouse();
            setDeletingBlockId(null);
        } catch (error) {
            toast.error('Failed to decommission block');
        } finally {
            setLoading(false);
        }
    };

    const resetBlockForm = () => {
        setBlockData({ height: 0, length: 0, breath: 0, type: 'RECKED' });
    };

    if (loading || !warehouse) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl shadow-primary/20"></div>
                <p className="text-muted font-black text-[10px] uppercase tracking-[0.2em]">Synchronizing storage matrix...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500">
            {/* Header with Back Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="p-4 bg-card rounded-2xl text-muted hover:text-sharp transition-all border border-card-border/50 shadow-sm group"
                    >
                        <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4">
                            Node Inspection
                        </h1>
                        <p className="text-sm font-medium text-muted mt-2">Precision storage hierarchy and terminal management</p>
                    </div>
                </div>
            </div>

            {/* Warehouse Info Card */}
            <div className="bg-card rounded-[3rem] border-2 border-card-border shadow-sm overflow-hidden group">
                <div className="p-12 border-b-2 border-card-border/30 bg-gradient-to-br from-primary/5 via-transparent to-transparent flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div className="flex items-center gap-8">
                        <div className="p-8 bg-primary rounded-[2rem] shadow-2xl shadow-primary/30 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500">
                            <WarehouseIcon className="h-12 w-12 text-white" />
                        </div>
                        <div>
                            <h2 className="text-5xl font-black text-sharp tracking-tighter">{warehouse.name}</h2>
                            <div className="flex items-center gap-4 mt-3">
                                <span className="px-4 py-2 bg-background/80 text-muted rounded-xl text-[10px] font-black uppercase tracking-widest border border-card-border/50 flex items-center gap-2">
                                    <MapPin size={12} className="text-primary" />
                                    {warehouse.city}
                                </span>
                                <span className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                                    <Activity size={12} className="animate-pulse" />
                                    Active Link
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-background/50 rounded-[2rem] border-2 border-card-border/30">
                        <div className="px-10 py-6 text-center border-r-2 border-card-border/30 last:border-0">
                            <div className="text-4xl font-black text-sharp tracking-tighter">{warehouse.rooms?.length || 0}</div>
                            <div className="text-[10px] font-black text-muted uppercase tracking-widest mt-2 leading-none">Rooms</div>
                        </div>
                        <div className="px-10 py-6 text-center">
                            <div className="text-4xl font-black text-primary tracking-tighter">
                                {warehouse.rooms?.reduce((acc, r) => acc + (r.blocks?.length || 0), 0) || 0}
                            </div>
                            <div className="text-[10px] font-black text-muted uppercase tracking-widest mt-2 leading-none">Terminals</div>
                        </div>
                    </div>
                </div>

                <div className="px-12 py-10 flex flex-col md:flex-row gap-8 text-sm text-muted">
                    <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-background rounded-xl border border-card-border/50 shrink-0">
                            <Navigation className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-muted">Precision Vector</p>
                            <p className="font-bold text-sharp text-base leading-relaxed">"{warehouse.address}"</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-background rounded-xl border border-card-border/50 shrink-0">
                            <Layout className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-muted">Auxiliary Reference</p>
                            <p className="font-bold text-sharp text-base italic leading-relaxed">Near {warehouse.landmark}</p>
                        </div>
                    </div>
                </div>
            </div>

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
                    <div className="grid grid-cols-1 gap-6">
                        {warehouse.rooms.map((room) => (
                            <div
                                key={room.roomId}
                                className={`bg-card rounded-[3rem] border-2 transition-all duration-500 overflow-hidden relative ${expandedRooms[room.roomId] ? 'border-primary shadow-2xl shadow-primary/5' : 'border-card-border shadow-sm hover:shadow-xl'}`}
                            >
                                {deletingRoomId === room.roomId && (
                                    <div className="absolute inset-0 bg-background/95 backdrop-blur-md z-[50] flex flex-col items-center justify-center p-12 gap-8 animate-in fade-in zoom-in-95 text-center">
                                        <div className="p-6 bg-red-500/10 rounded-full text-red-500 border border-red-500/20">
                                            <Trash2 size={48} />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-sharp uppercase tracking-tighter mb-4">Purge Storage Room?</h4>
                                            <p className="text-sm text-muted font-bold uppercase tracking-widest max-w-sm mx-auto">
                                                Warning: All terminal nodes associated with <span className="text-sharp">"{room.name}"</span> will be permanentely erased from the matrix.
                                            </p>
                                        </div>
                                        <div className="flex gap-4 w-full max-w-md">
                                            <Button size="lg" className="flex-1 bg-red-600 hover:bg-red-700 h-16 text-xs font-black uppercase tracking-widest shadow-xl shadow-red-500/20" onClick={() => handleDeleteRoom(room.roomId)} isLoading={loading}>
                                                Confirm Purge
                                            </Button>
                                            <Button variant="ghost" size="lg" className="flex-1 h-16 text-xs font-black uppercase tracking-widest" onClick={() => setDeletingRoomId(null)}>
                                                Stand Down
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer select-none gap-6 ${expandedRooms[room.roomId] ? 'bg-primary/5' : 'hover:bg-primary/5'}`}
                                    onClick={() => toggleRoom(room.roomId)}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${expandedRooms[room.roomId] ? 'bg-primary text-white rotate-90 scale-110' : 'bg-background border border-card-border text-muted group-hover:text-primary'}`}>
                                            <ChevronRight className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-black text-sharp text-3xl tracking-tighter">{room.name}</span>
                                                <span className="text-[10px] bg-background border border-card-border/50 text-muted px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
                                                    {room.blocks?.length || 0} TERMINALS
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-12 w-12 rounded-xl border border-card-border/50 bg-background hover:bg-primary/10 hover:text-primary transition-all p-0"
                                            onClick={() => handleEditRoom(room)}
                                        >
                                            <Settings2 size={20} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-12 w-12 rounded-xl border border-card-border/50 bg-background hover:bg-red-500/10 hover:text-red-500 transition-all p-0"
                                            onClick={() => setDeletingRoomId(room.roomId)}
                                        >
                                            <Trash2 size={20} />
                                        </Button>
                                        <div className="h-8 w-[2px] bg-card-border/30 mx-2 hidden md:block" />
                                        <Button
                                            className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10"
                                            onClick={() => {
                                                setAddingBlockToRoomId(room.roomId);
                                                setShowBlockModal(true);
                                            }}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Spawn Block
                                        </Button>
                                    </div>
                                </div>

                                {expandedRooms[room.roomId] && (
                                    <div className="px-10 pb-12 pt-4 space-y-8 animate-in slide-in-from-top-4 duration-500">
                                        <div className="h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />

                                        {room.blocks && room.blocks.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {room.blocks.map((block) => (
                                                    <div key={block.blockId} className="bg-background/80 rounded-[2.5rem] p-8 border-2 border-card-border/30 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all relative group/block">
                                                        {deletingBlockId === block.blockId && (
                                                            <div className="absolute inset-0 bg-background/95 backdrop-blur-md rounded-[2.5rem] z-20 flex flex-col items-center justify-center p-6 gap-6 animate-in fade-in">
                                                                <p className="text-[10px] font-black text-sharp text-center uppercase tracking-widest leading-relaxed">Sever Block Link?</p>
                                                                <div className="flex gap-2 w-full">
                                                                    <Button size="sm" className="flex-1 bg-red-600 h-10 text-[8px] font-black uppercase tracking-[0.2em]" onClick={() => handleDeleteBlock(block.blockId)} isLoading={loading}>
                                                                        Confirm
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" className="flex-1 h-10 text-[8px] font-black uppercase tracking-[0.2em]" onClick={() => setDeletingBlockId(null)}>
                                                                        Abort
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-start mb-6">
                                                            <div className={`p-4 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover/block:rotate-12 ${block.type === 'RECKED' ? 'bg-amber-500/10 text-amber-500 shadow-amber-500/5' : 'bg-primary/10 text-primary shadow-primary/5'}`}>
                                                                <BoxIcon className="h-6 w-6" />
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleEditBlock(block)}
                                                                    className="p-2 hover:bg-primary/10 rounded-lg text-muted hover:text-primary transition-all"
                                                                >
                                                                    <Settings2 className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeletingBlockId(block.blockId)}
                                                                    className="p-2 hover:bg-red-500/10 rounded-lg text-muted hover:text-red-500 transition-all"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div>
                                                                <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] font-mono mb-2">NODE_ID</p>
                                                                <p className="text-sm font-black text-sharp tracking-tight truncate">{block.blockId.slice(0, 12)}...</p>
                                                            </div>

                                                            <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] inline-block border ${block.type === 'RECKED' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-primary/5 text-primary border-primary/20'}`}>
                                                                {block.type === 'RECKED' ? 'SHELVED_ASSET' : 'FLOOR_ALLOCATION'}
                                                            </span>

                                                            <div className="grid grid-cols-3 gap-3">
                                                                <div className="bg-card p-3 rounded-2xl border border-card-border/50 text-center">
                                                                    <p className="text-[8px] font-black text-muted uppercase mb-1">Vector_H</p>
                                                                    <p className="text-sm font-black text-sharp tabular-nums">{block.height}m</p>
                                                                </div>
                                                                <div className="bg-card p-3 rounded-2xl border border-card-border/50 text-center">
                                                                    <p className="text-[8px] font-black text-muted uppercase mb-1">Vector_L</p>
                                                                    <p className="text-sm font-black text-sharp tabular-nums">{block.length}m</p>
                                                                </div>
                                                                <div className="bg-card p-3 rounded-2xl border border-card-border/50 text-center">
                                                                    <p className="text-[8px] font-black text-muted uppercase mb-1">Vector_B</p>
                                                                    <p className="text-sm font-black text-sharp tabular-nums">{block.breath}m</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-20 bg-background/50 rounded-[3rem] border-2 border-dashed border-card-border/50 text-center">
                                                <Cpu className="h-16 w-16 text-muted/10 mx-auto mb-6" />
                                                <p className="text-muted font-black uppercase tracking-[0.3em] text-[10px]">Matrix Layer Null</p>
                                                <p className="text-[10px] text-muted/40 mt-4 font-bold uppercase tracking-widest">No storage components detected at this level.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-60 border-4 border-dashed border-card-border rounded-[5rem] text-center bg-card/10">
                        <BoxSelect className="h-32 w-32 text-muted/10 mx-auto mb-10" />
                        <h4 className="text-2xl font-black text-muted uppercase tracking-[0.5em]">Storage Void</h4>
                        <p className="text-sm text-muted/40 mt-8 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                            The warehouse matrix has no initialized partitions. Commence room registration to define the storage hierarchy.
                        </p>
                        <Button
                            variant="ghost"
                            className="mt-12 text-[10px] font-black uppercase tracking-[0.3em]"
                            onClick={() => setShowRoomModal(true)}
                        >
                            Executive Partitioning
                        </Button>
                    </div>
                )}
            </div>

            {/* Room Modal */}
            {showRoomModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-500">
                    <div className="bg-card rounded-[4rem] p-12 max-w-xl w-full border-2 border-card-border shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-4xl font-black text-sharp tracking-tighter">
                                    {editingRoom ? 'Adjust Partition' : 'Add Partition'}
                                </h3>
                                <p className="text-sm font-medium text-muted mt-2">
                                    {editingRoom ? 'Redefining storage space parameters' : 'Initializing new storage room sector'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowRoomModal(false);
                                    setEditingRoom(null);
                                    setRoomName('');
                                }}
                                className="p-4 bg-background rounded-3xl text-muted hover:text-sharp transition-all border border-card-border/50"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <form onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom} className="space-y-10">
                            <div>
                                <Input
                                    label="Partition Designation *"
                                    required
                                    className="py-6 px-8 rounded-[2rem] font-black text-xl"
                                    placeholder="e.g. COLD_STORAGE_A"
                                    value={roomName}
                                    onChange={e => setRoomName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-card-border/30">
                                <Button
                                    type="submit"
                                    className="flex-1 py-7 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/30 h-18"
                                    isLoading={loading}
                                >
                                    {editingRoom ? 'Update Specification' : 'Finalize Partition'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest"
                                    onClick={() => {
                                        setShowRoomModal(false);
                                        setEditingRoom(null);
                                        setRoomName('');
                                    }}
                                >
                                    Abort
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Block Modal */}
            {showBlockModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-500">
                    <div className="bg-card rounded-[4rem] p-12 max-w-2xl w-full border-2 border-card-border shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-4xl font-black text-sharp tracking-tighter">
                                    {editingBlock ? 'Block Re-alignment' : 'Terminal Spawning'}
                                </h3>
                                <p className="text-sm font-medium text-muted mt-2">
                                    Define technical dimensions and operational tier
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowBlockModal(false);
                                    setEditingBlock(null);
                                    setAddingBlockToRoomId(null);
                                    resetBlockForm();
                                }}
                                className="p-4 bg-background rounded-3xl text-muted hover:text-sharp transition-all border border-card-border/50"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <form onSubmit={editingBlock ? handleUpdateBlock : handleAddBlock} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <Input
                                    label="Vertical Vector (m)"
                                    type="number"
                                    step="0.1"
                                    required
                                    className="py-5 px-6 rounded-3xl font-black text-lg"
                                    value={blockData.height || ''}
                                    onChange={e => setBlockData({ ...blockData, height: parseFloat(e.target.value) || 0 })}
                                />
                                <Input
                                    label="Longitude Vector (m)"
                                    type="number"
                                    step="0.1"
                                    required
                                    className="py-5 px-6 rounded-3xl font-black text-lg"
                                    value={blockData.length || ''}
                                    onChange={e => setBlockData({ ...blockData, length: parseFloat(e.target.value) || 0 })}
                                />
                                <Input
                                    label="Breadth Vector (m)"
                                    type="number"
                                    step="0.1"
                                    required
                                    className="py-5 px-6 rounded-3xl font-black text-lg"
                                    value={blockData.breath || ''}
                                    onChange={e => setBlockData({ ...blockData, breath: parseFloat(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2">Operational Tier Configuration</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setBlockData({ ...blockData, type: 'RECKED' })}
                                        className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${blockData.type === 'RECKED' ? 'border-primary bg-primary/5 shadow-inner' : 'border-card-border hover:border-primary/50'}`}
                                    >
                                        <Layers className={`h-8 w-8 ${blockData.type === 'RECKED' ? 'text-primary' : 'text-muted'}`} />
                                        <div className="text-center">
                                            <p className="text-xs font-black text-sharp uppercase">SHELVED_RECK</p>
                                            <p className="text-[10px] text-muted mt-1 uppercase font-bold">Standard stacking logic</p>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setBlockData({ ...blockData, type: 'UNRECKED' })}
                                        className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${blockData.type === 'UNRECKED' ? 'border-primary bg-primary/5 shadow-inner' : 'border-card-border hover:border-primary/50'}`}
                                    >
                                        <Maximize2 className={`h-8 w-8 ${blockData.type === 'UNRECKED' ? 'text-primary' : 'text-muted'}`} />
                                        <div className="text-center">
                                            <p className="text-xs font-black text-sharp uppercase">FLOOR_MAX</p>
                                            <p className="text-[10px] text-muted mt-1 uppercase font-bold">Raw volumetric allocation</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-card-border/30">
                                <Button
                                    type="submit"
                                    className="flex-1 py-7 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/30 h-18"
                                    isLoading={loading}
                                >
                                    {editingBlock ? 'Finalize Vector shift' : 'Initiate Spawning'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest"
                                    onClick={() => {
                                        setShowBlockModal(false);
                                        setEditingBlock(null);
                                        setAddingBlockToRoomId(null);
                                        resetBlockForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
