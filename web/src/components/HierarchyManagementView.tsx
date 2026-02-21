'use client';

import { useEffect, useState } from 'react';
import httpClient from '@/lib/httpClient';
import type { RoomResponse, BlockResponse, InventoryResponse } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Network, ArrowLeft, Layers, LayoutGrid } from 'lucide-react';
import { notify } from '@/lib/notify';
import RoomList from './hierarchy/RoomList';
import BlockList from './hierarchy/BlockList';
import { Room } from './hierarchy/RoomCard';
import { Block } from './hierarchy/BlockCard';
import { Inventory } from './hierarchy/InventoryDetails';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorState from './ui/ErrorState';

export default function HierarchyManagementView() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [view, setView] = useState<'rooms' | 'blocks'>('rooms');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setError(false);
            setLoading(true);
            const [roomsData, blocksData, inventoriesData] = await Promise.all([
                httpClient.get<RoomResponse[]>('/rooms'),
                httpClient.get<BlockResponse[]>('/blocks'),
                httpClient.get<InventoryResponse[]>('/inventory'),
            ]);
            setRooms(roomsData as unknown as Room[]);
            setBlocks(blocksData as unknown as Block[]);
            setInventories(inventoriesData as unknown as Inventory[]);
        } catch {
            setError(true);
            notify.error('Failed to fetch hierarchy data');
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

    if (loading && rooms.length === 0) {
        return <LoadingSpinner message="Mapping logistics topology..." />;
    }

    if (error && rooms.length === 0) {
        return <ErrorState onRetry={fetchData} message="Topology Mapping Failed" />;
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4 italic uppercase">
                        <Network className="h-10 w-10 text-primary" />
                        {selectedRoom ? `${selectedRoom.name}` : 'Topological Grid'}
                    </h1>
                    <p className="text-sm font-medium text-muted mt-2 max-w-xl">
                        {selectedRoom
                            ? `Orchestrating storage nodes and resource distribution within the ${selectedRoom.name} sector.`
                            : 'Strategic oversight of the global warehouse architecture and spatial hierarchy.'
                        }
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    {selectedRoom && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBackToRooms}
                            className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-6 shadow-sm hover:shadow-md transition-all"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Grid Overview
                        </Button>
                    )}

                    <div className="flex bg-card/80 backdrop-blur-md p-1.5 rounded-[1.5rem] border-2 border-card-border shadow-xl">
                        <Button
                            variant={view === 'rooms' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => {
                                setView('rooms');
                                setSelectedRoom(null);
                            }}
                            className={`rounded-xl h-11 px-6 text-[10px] font-black uppercase tracking-widest ${view === 'rooms' ? 'shadow-lg shadow-primary/25' : 'text-muted hover:text-sharp hover:bg-sharp/5'}`}
                        >
                            <Layers className="h-4 w-4 mr-2" />
                            Sectors
                        </Button>
                        <Button
                            variant={view === 'blocks' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setView('blocks')}
                            className={`rounded-xl h-11 px-6 text-[10px] font-black uppercase tracking-widest ${view === 'blocks' ? 'shadow-lg shadow-primary/25' : 'text-muted hover:text-sharp hover:bg-sharp/5'}`}
                        >
                            <LayoutGrid className="h-4 w-4 mr-2" />
                            Nodes
                        </Button>
                    </div>
                </div>
            </header>

            <div className="pt-2">
                {view === 'rooms' ? (
                    <RoomList rooms={rooms} blocks={blocks} onRoomClick={handleRoomClick} />
                ) : (
                    <BlockList blocks={filteredBlocks} inventories={inventories} selectedRoom={selectedRoom} />
                )}
            </div>
        </div>
    );
}
