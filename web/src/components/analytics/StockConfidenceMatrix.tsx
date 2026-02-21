import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ShieldCheck } from 'lucide-react';
import type { StockConfidenceResponse } from '@/types/api';

interface StockConfidenceMatrixProps {
    data: StockConfidenceResponse[];
}

const StockConfidenceMatrix: React.FC<StockConfidenceMatrixProps> = ({ data }) => {
    return (
        <Card className="shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-card-border/30">
                <CardTitle className="flex items-center gap-4 text-sharp italic">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-600">
                        <ShieldCheck size={20} />
                    </div>
                    Asset Integrity Matrix
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
                {data && data.length > 0 ? (
                    data.map((stock) => (
                        <div key={stock.productId} className="flex flex-col gap-4 p-8 bg-background/50 rounded-[2.5rem] border-2 border-card-border/50 hover:border-primary/40 transition-all group">
                            <div className="flex justify-between items-center">
                                <div className="min-w-0">
                                    <div className="font-black text-sharp text-lg group-hover:text-primary transition-colors truncate">{stock.productName}</div>
                                    <div className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">SKU: {stock.productId.slice(0, 8)}</div>
                                </div>
                                <Badge
                                    variant={stock.confidenceLevel === 'HIGH' ? 'success' : stock.confidenceLevel === 'MEDIUM' ? 'warning' : 'danger'}
                                    className="h-10 px-4 flex items-center gap-3 border-2 shrink-0 shadow-lg shadow-black/5"
                                >
                                    <span className="font-black text-xs leading-none">{stock.confidenceScore}%</span>
                                    <span className="text-[8px] font-black uppercase tracking-wider opacity-60">RELIABILITY</span>
                                </Badge>
                            </div>
                            <div className="w-full bg-card border border-card-border rounded-full h-3 p-0.5 overflow-hidden shadow-inner">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${stock.confidenceLevel === 'HIGH' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' :
                                        stock.confidenceLevel === 'MEDIUM' ? 'bg-amber-500' :
                                            'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                                        }`}
                                    style={{ width: `${stock.confidenceScore}%` }}
                                ></div>
                            </div>
                            <div className="flex items-start gap-3 bg-card px-4 py-3 rounded-2xl border border-card-border/30 shadow-sm">
                                <div className="text-[8px] font-black text-muted uppercase tracking-widest bg-background px-2 py-1 rounded-lg border border-card-border/50 shrink-0 mt-0.5">LOGIC</div>
                                <p className="text-[10px] text-muted font-bold italic line-clamp-2 leading-relaxed">&quot;{stock.reason}&quot;</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-background rounded-[2.5rem] border-4 border-dashed border-card-border">
                        <p className="text-muted font-black text-sm uppercase tracking-[0.5em]">System Trust Nominal</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default StockConfidenceMatrix;
