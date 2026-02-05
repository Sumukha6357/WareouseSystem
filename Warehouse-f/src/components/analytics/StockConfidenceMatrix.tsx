import React from 'react';
import { StockConfidenceResponse } from '../../services/AnalyticsService';

interface StockConfidenceMatrixProps {
    data: StockConfidenceResponse[];
}

const StockConfidenceMatrix: React.FC<StockConfidenceMatrixProps> = ({ data }) => {
    return (
        <div className="bg-card p-10 rounded-[3.5rem] border-2 border-card-border shadow-sm">
            <h2 className="text-2xl font-black text-sharp mb-10 uppercase tracking-widest flex items-center gap-4">
                <span className="text-3xl">🛡️</span>
                Stock Integrity Confidence Matrix
            </h2>
            <div className="space-y-6">
                {data && data.length > 0 ? (
                    data.map((stock) => (
                        <div key={stock.productId} className="flex flex-col gap-3 p-6 bg-background rounded-[2rem] border-2 border-card-border hover:border-primary/50 transition-all group">
                            <div className="flex justify-between items-center">
                                <span className="font-black text-sharp text-lg group-hover:text-primary transition-colors">{stock.productName}</span>
                                <span className={`text-[10px] font-black px-4 py-2 rounded-xl border-2 uppercase tracking-widest ${stock.confidenceLevel === 'HIGH' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' :
                                    stock.confidenceLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' :
                                        'bg-red-500/10 text-red-700 border-red-500/20'
                                    }`}>
                                    {stock.confidenceScore}% RELIABILITY
                                </span>
                            </div>
                            <div className="w-full bg-card border border-card-border rounded-full h-3 p-0.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${stock.confidenceLevel === 'HIGH' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' :
                                        stock.confidenceLevel === 'MEDIUM' ? 'bg-amber-500' :
                                            'bg-red-500'
                                        }`}
                                    style={{ width: `${stock.confidenceScore}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-muted font-black uppercase tracking-wider bg-card px-3 py-2 rounded-xl border border-card-border/50 inline-block self-start">Integrity Logic: {stock.reason}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 opacity-50 uppercase font-black text-xs tracking-widest">Complete System Trust Maintained</div>
                )}
            </div>
        </div>
    );
};

export default StockConfidenceMatrix;
