import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { BlockUtilizationResponse } from '@/types/api';

interface BlockUtilizationChartProps {
    data: BlockUtilizationResponse[];
}

const BlockUtilizationChart: React.FC<BlockUtilizationChartProps> = ({ data }) => {
    return (
        <Card className="shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <ShieldCheck size={300} className="text-primary" />
            </div>
            <CardHeader className="pb-8 border-b border-card-border/30">
                <CardTitle className="flex items-center gap-4 text-sharp italic">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <ShieldCheck size={20} />
                    </div>
                    High Density Resource Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.length > 0 ? (
                        data.map((block) => (
                            <div key={block.blockId} className="p-8 rounded-[2.5rem] border-2 border-card-border bg-background hover:border-primary/50 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="min-w-0">
                                        <div className="font-black text-sharp text-lg group-hover:text-primary transition-colors truncate">{block.blockName}</div>
                                        <div className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">REF: {block.blockId.slice(0, 8)}</div>
                                    </div>
                                    <Badge
                                        variant={block.occupancyPercentage >= 90 ? 'danger' : block.occupancyPercentage >= 70 ? 'warning' : 'success'}
                                        className="h-8 px-3 text-[9px] font-black uppercase tracking-widest border-2 shrink-0"
                                    >
                                        {block.utilizationLevel}
                                    </Badge>
                                </div>
                                <div className="w-full bg-card border border-card-border rounded-full h-4 mb-4 overflow-hidden p-1 shadow-inner">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${block.occupancyPercentage >= 90 ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]' :
                                            block.occupancyPercentage >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`}
                                        style={{ width: `${Math.min(100, block.occupancyPercentage)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-muted font-black uppercase tracking-widest bg-card px-3 py-1.5 rounded-xl border border-card-border/30">
                                        DENSITY: <span className="text-sharp">{block.occupancyPercentage.toFixed(1)}%</span>
                                    </span>
                                    <span className="text-[10px] text-muted font-black uppercase tracking-widest bg-card px-3 py-1.5 rounded-xl border border-card-border/30">
                                        VACANT: <span className="text-sharp">{(100 - block.occupancyPercentage).toFixed(1)}%</span>
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-background rounded-[3rem] border-4 border-dashed border-card-border">
                            <p className="text-muted font-black text-sm uppercase tracking-[0.4em]">Theoretical Optimal Capacity Maintained</p>
                            <p className="text-[10px] text-muted/40 font-bold uppercase tracking-widest mt-4">All logistics clusters operating within nominal density parameters.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default BlockUtilizationChart;
