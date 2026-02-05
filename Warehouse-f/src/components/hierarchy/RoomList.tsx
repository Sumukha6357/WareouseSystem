import React from 'react';
import RoomCard, { Room } from './RoomCard';
import { Block } from './BlockCard';

interface RoomListProps {
    rooms: Room[];
    blocks: Block[];
    onRoomClick: (room: Room) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, blocks, onRoomClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
                <RoomCard
                    key={room.roomId}
                    room={room}
                    blockCount={blocks.filter(b => b.room?.roomId === room.roomId).length}
                    onClick={onRoomClick}
                />
            ))}
            {rooms.length === 0 && (
                <div className="col-span-full py-24 text-center bg-card rounded-3xl border-2 border-dashed border-card-border">
                    <p className="text-muted font-black uppercase tracking-widest text-xs">No storage chambers mapped</p>
                </div>
            )}
        </div>
    );
};

export default RoomList;
