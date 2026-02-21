import React from 'react';
import BlockCard, { Block } from './BlockCard';
import { Inventory } from './InventoryDetails';

interface BlockListProps {
    blocks: Block[];
    inventories: Inventory[];
    selectedRoom: { roomId: string; name: string } | null;
}

const BlockList: React.FC<BlockListProps> = ({ blocks, inventories, selectedRoom }) => {
    const getBlockInventories = (blockId: string) => {
        return inventories.filter(inv => inv.blockId === blockId);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blocks.map((block) => (
                <BlockCard
                    key={block.blockId}
                    block={block}
                    inventories={getBlockInventories(block.blockId)}
                    selectedRoom={selectedRoom}
                />
            ))}
            {blocks.length === 0 && (
                <div className="col-span-full py-24 text-center bg-card rounded-3xl border-2 border-dashed border-card-border">
                    <p className="text-muted font-black uppercase tracking-widest text-xs">
                        {selectedRoom ? `No nodes in ${selectedRoom.name}` : 'No storage nodes found'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BlockList;
