import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { BlockUtilizationResponse } from '../../services/AnalyticsService';

interface BlockUtilizationChartProps {
    data: BlockUtilizationResponse[];
}

const BlockUtilizationChart: React.FC<BlockUtilizationChartProps> = ({ data }) => {
    return (
        <div className="bg-card p-10 rounded-[3.5rem] border-2 border-card-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck size={200} className="text-primary" />
            </div>
            <h2 className="text-2xl font-black text-sharp mb-10 uppercase tracking-widest flex items-center gap-4">
                <ShieldCheck className="text-primary" size={32} strokeWidth={2.5} />
                High Density Block Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.length > 0 ? (
                    data.map((block) => (
                        <div key={block.blockId} className="p-8 rounded-[2.5rem] border-2 border-card-border bg-background hover:border-primary/50 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <span className="font-black text-sharp text-lg group-hover:text-primary transition-colors">{block.blockName}</span>
                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border-2 uppercase tracking-widest ${block.occupancyPercentage >= 90 ? 'bg-red-500/10 text-red-700 border-red-500/20' :
                                    block.occupancyPercentage >= 70 ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                                    }`}>
                                    {block.utilizationLevel}
                                </span>
                            </div>
                            <div className="w-full bg-card border border-card-border rounded-full h-4 mb-4 overflow-hidden p-1">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${block.occupancyPercentage >= 90 ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]' :
                                        block.occupancyPercentage >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`}
                                    style={{ width: `${Math.min(100, block.occupancyPercentage)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-muted font-black uppercase tracking-widest">
                                <span className="bg-card px-2 py-1 rounded-lg border border-card-border/50">DENSITY: {block.occupancyPercentage.toFixed(1)}%</span>
                                <span className="bg-card px-2 py-1 rounded-lg border border-card-border/50">VACANT: {(100 - block.occupancyPercentage).toFixed(1)}%</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-background rounded-[3rem] border-4 border-dashed border-card-border">
                        <p className="text-muted font-black text-sm uppercase tracking-[0.3em]">Theoretical Optimal Capacity Maintained</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockUtilizationChart;
