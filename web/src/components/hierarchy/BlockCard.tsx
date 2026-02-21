import React from 'react';
import { Box as BoxIcon, AlertTriangle, Building } from 'lucide-react';
import InventoryDetails, { Inventory } from './InventoryDetails';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
    const isRacked = block.type === 'RECKED';

    return (
        <Card
            className={`p-0 overflow-hidden ${hasLowStock ? 'border-amber-500/30' : ''}`}
        >
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${isRacked ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                        <BoxIcon className="h-5 w-5" />
                    </div>
                    <div className="flex gap-2 items-center">
                        {hasLowStock && <AlertTriangle className="h-4 w-4 text-amber-600 animate-pulse" />}
                        <Badge variant={isRacked ? 'warning' : 'success'}>
                            {block.type}
                        </Badge>
                    </div>
                </div>

                {block.room && !selectedRoom && (
                    <p className="text-[10px] font-black text-primary flex items-center gap-2 uppercase tracking-widest mt-3">
                        <Building className="h-3 w-3" />
                        {block.room.name}
                    </p>
                )}
                <p className="text-[9px] font-mono font-bold text-muted uppercase tracking-tighter opacity-40">Node: {block.blockId}</p>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Dimensions */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                        { label: 'H', value: `${block.height}m` },
                        { label: 'L', value: `${block.length}m` },
                        { label: 'B', value: `${block.breath}m` },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-background p-3 rounded-2xl border border-card-border/50">
                            <p className="text-[9px] font-black text-muted uppercase tracking-tighter">{label}</p>
                            <p className="text-sm font-black text-sharp">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Capacity Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">Volumetric Load</span>
                        <span className="text-xs font-black text-sharp tabular-nums">
                            {occupied.toFixed(0)} / {totalCapacity.toFixed(0)} m³
                        </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-3 border border-card-border/50 p-0.5">
                        <div
                            className={`h-full rounded-full transition-all duration-700 shadow-sm ${utilization > 80 ? 'bg-red-500 shadow-red-500/30' : utilization > 50 ? 'bg-amber-500 shadow-amber-500/30' : 'bg-primary shadow-primary/30'}`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest text-right">{utilization.toFixed(1)}% Full</p>
                </div>

                <InventoryDetails inventories={inventories} />
            </CardContent>
        </Card>
    );
};

export default BlockCard;
