import React from 'react';
import { Clock, Wifi } from 'lucide-react';
import { SystemHealth } from '../../services/SystemHealthService';

interface SystemHealthPanelProps {
    health: SystemHealth | null;
}

const SystemHealthPanel: React.FC<SystemHealthPanelProps> = ({ health }) => {
    if (!health) return null;

    return (
        <div className="flex flex-wrap items-center gap-4 mt-3">
            <span className={`flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-xl border-2 uppercase tracking-[0.15em] ${health.systemStatus === 'OPTIMAL' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20' :
                health.systemStatus === 'STRESSED' ? 'bg-amber-500/5 text-amber-600 border-amber-500/20' : 'bg-red-500/5 text-red-600 border-red-500/20 animate-pulse'
                }`}>
                <div className={`w-2 h-2 rounded-full ${health.systemStatus === 'OPTIMAL' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : health.systemStatus === 'STRESSED' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-red-500'}`} />
                NODE: {health.systemStatus}
            </span>
            <span className="flex items-center gap-2 text-[10px] text-muted font-black uppercase tracking-widest bg-background px-3 py-1.5 rounded-xl border border-card-border/50">
                <Clock size={12} className="text-primary" />
                LATENCY: {health.apiLatencyMs.toFixed(0)}MS
            </span>
            <span className="flex items-center gap-2 text-[10px] text-muted font-black uppercase tracking-widest bg-background px-3 py-1.5 rounded-xl border border-card-border/50">
                <Wifi size={12} className="text-primary" />
                CONCURRENCY: {health.webSocketSessions}
            </span>
        </div>
    );
};

export default SystemHealthPanel;
