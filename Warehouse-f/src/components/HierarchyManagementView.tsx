'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Network } from 'lucide-react';
import toast from 'react-hot-toast';
import RoomList from './hierarchy/RoomList';
import BlockList from './hierarchy/BlockList';
import { Room } from './hierarchy/RoomCard';
import { Block } from './hierarchy/BlockCard';
import { Inventory } from './hierarchy/InventoryDetails';

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-muted font-medium italic">Mapping logistics topology...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-sharp tracking-tight flex items-center gap-3">
                        <Network className="h-7 w-7 text-primary" />
                        {selectedRoom ? `${selectedRoom.name}` : 'Topological Grid'}
                    </h3>
                    <p className="text-sm font-medium text-muted">
                        {selectedRoom ? `Managing storage units within ${selectedRoom.name}` : 'Global orchestration of storage architecture'}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {selectedRoom && (
                        <Button variant="outline" size="sm" onClick={handleBackToRooms} className="rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
                            ← Return to Grid
                        </Button>
                    )}
                    <div className="flex bg-card p-1.5 rounded-2xl border-2 border-input-border shadow-sm">
                        <button
                            onClick={() => {
                                setView('rooms');
                                setSelectedRoom(null);
                            }}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'rooms' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:text-sharp'}`}
                        >
                            Rooms
                        </button>
                        <button
                            onClick={() => setView('blocks')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'blocks' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:text-sharp'}`}
                        >
                            Blocks
                        </button>
                    </div>
                </div>
            </header>

            {view === 'rooms' ? (
                <RoomList rooms={rooms} blocks={blocks} onRoomClick={handleRoomClick} />
            ) : (
                <BlockList blocks={filteredBlocks} inventories={inventories} selectedRoom={selectedRoom} />
            )}
        </div>
    );
}
