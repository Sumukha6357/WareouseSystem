import React from 'react';
import { Layers, Link as LinkIcon } from 'lucide-react';
import { Block } from './BlockCard';

export interface Room {
    roomId: string;
    name: string;
}

interface RoomCardProps {
    room: Room;
    blockCount: number;
    onClick: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, blockCount, onClick }) => {
    return (
        <div className="bg-card p-8 rounded-3xl border border-card-border shadow-sm flex items-center gap-6 group hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer" onClick={() => onClick(room)}>
            <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Layers className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-black text-sharp text-lg group-hover:text-primary transition-colors truncate">{room.name}</h4>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                    {blockCount} Storage Nodes
                </p>
                <p className="text-[10px] font-mono font-bold text-muted uppercase tracking-tighter mt-2 truncate opacity-50">ID: {room.roomId}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                <LinkIcon className="h-4 w-4 text-primary" />
            </div>
        </div>
    );
};

export default RoomCard;
