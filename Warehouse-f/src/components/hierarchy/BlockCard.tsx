import React from 'react';
import { Box as BoxIcon, AlertTriangle, Building } from 'lucide-react';
import InventoryDetails, { Inventory } from './InventoryDetails';

export interface Block {
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

interface BlockCardProps {
    block: Block;
    inventories: Inventory[];
    selectedRoom: { roomId: string; name: string } | null;
}

const BlockCard: React.FC<BlockCardProps> = ({ block, inventories, selectedRoom }) => {
    const getBlockCapacity = () => {
        const totalCapacity = block.height * block.length * block.breath;
        const occupied = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
        const utilization = totalCapacity > 0 ? (occupied / totalCapacity) * 100 : 0;
        return { totalCapacity, occupied, utilization };
    };

    const { totalCapacity, occupied, utilization } = getBlockCapacity();
    const hasLowStock = inventories.some(inv => inv.isLowStock);

    return (
        <div
            className={`bg-card p-8 rounded-3xl border-2 transition-all hover:shadow-2xl hover:shadow-primary/5 ${hasLowStock ? 'border-amber-500/50 bg-amber-500/5' : 'border-card-border'
                }`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${block.type === 'RECKED' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                    <BoxIcon className="h-5 w-5" />
                </div>
                <div className="flex gap-2 items-center">
                    {hasLowStock && <AlertTriangle className="h-4 w-4 text-amber-600 animate-pulse" />}
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-current/10 ${block.type === 'RECKED' ? 'bg-amber-500/10 text-amber-700' : 'bg-emerald-500/10 text-emerald-700'}`}>
                        {block.type}
                    </span>
                </div>
            </div>

            <div>
                {block.room && !selectedRoom && (
                    <p className="text-[10px] font-black text-primary mb-3 flex items-center gap-2 uppercase tracking-widest">
                        <Building className="h-3 w-3" />
                        {block.room.name}
                    </p>
                )}
                <p className="text-[10px] font-mono font-bold text-muted uppercase tracking-tighter mb-4 opacity-50">Node: {block.blockId}</p>

                {/* Dimensions */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center mb-6">
                    <div className="bg-background p-3 rounded-2xl border border-card-border/50">
                        <p className="text-[9px] font-black text-muted uppercase tracking-tighter">H</p>
                        <p className="text-sm font-black text-sharp">{block.height}m</p>
                    </div>
                    <div className="bg-background p-3 rounded-2xl border border-card-border/50">
                        <p className="text-[9px] font-black text-muted uppercase tracking-tighter">L</p>
                        <p className="text-sm font-black text-sharp">{block.length}m</p>
                    </div>
                    <div className="bg-background p-3 rounded-2xl border border-card-border/50">
                        <p className="text-[9px] font-black text-muted uppercase tracking-tighter">B</p>
                        <p className="text-sm font-black text-sharp">{block.breath}m</p>
                    </div>
                </div>

                {/* Capacity Bar */}
                <div className="mb-6 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">Volumetric Load</span>
                        <span className="text-xs font-black text-sharp tabular-nums">
                            {occupied.toFixed(0)} / {totalCapacity.toFixed(0)} m³
                        </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-3 border border-card-border/50 p-0.5">
                        <div
                            className={`h-full rounded-full transition-all duration-700 shadow-sm ${utilization > 80 ? 'bg-red-500' : utilization > 50 ? 'bg-amber-500' : 'bg-primary'
                                }`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest text-right">{utilization.toFixed(1)}% Full</p>
                </div>

                <InventoryDetails inventories={inventories} />
            </div>
        </div>
    );
};

export default BlockCard;
