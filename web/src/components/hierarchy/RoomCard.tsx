import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
        <Card
            className="p-8 flex items-center gap-6 group cursor-pointer border-2 hover:border-primary/30"
            onClick={() => onClick(room)}
        >
            <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
                <Layers className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-black text-sharp text-lg group-hover:text-primary transition-colors truncate uppercase italic">{room.name}</h4>
                <div className="flex items-center gap-3 mt-2">
                    <Badge variant="primary">
                        {blockCount} Nodes
                    </Badge>
                </div>
                <p className="text-[9px] font-mono font-bold text-muted uppercase tracking-tighter mt-2 truncate opacity-40">ID: {room.roomId}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shrink-0">
                <ArrowRight className="h-5 w-5 text-primary" />
            </div>
        </Card>
    );
};

export default RoomCard;
