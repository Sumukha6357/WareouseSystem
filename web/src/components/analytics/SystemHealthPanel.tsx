import { Clock, Wifi } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { SystemHealthResponse as SystemHealth } from '@/types/api';

interface SystemHealthPanelProps {
    health: SystemHealth | null;
}

const SystemHealthPanel: React.FC<SystemHealthPanelProps> = ({ health }) => {
    if (!health) return null;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'OPTIMAL': return 'success';
            case 'STRESSED': return 'warning';
            default: return 'danger';
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-4 mt-1">
            <Badge
                variant={getStatusVariant(health.systemStatus) as 'success' | 'warning' | 'danger'}
                className="h-10 px-6 flex items-center gap-3 border-2 shadow-lg shadow-emerald-500/5 group"
            >
                <div className={`w-2 h-2 rounded-full ${health.systemStatus === 'OPTIMAL' ? 'bg-emerald-500 animate-pulse-subtle' :
                    health.systemStatus === 'STRESSED' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                NODE: {health.systemStatus}
            </Badge>

            <div className="flex items-center gap-4 bg-background/50 backdrop-blur-md px-6 h-10 rounded-2xl border border-card-border/50 shadow-sm">
                <div className="flex items-center gap-3">
                    <Clock size={14} className="text-primary/60" />
                    <span className="text-[10px] text-muted font-black uppercase tracking-widest whitespace-nowrap">
                        LATENCY: <span className="text-sharp">{health.apiLatencyMs.toFixed(0)}MS</span>
                    </span>
                </div>
                <div className="w-[1px] h-4 bg-card-border/50" />
                <div className="flex items-center gap-3">
                    <Wifi size={14} className="text-primary/60" />
                    <span className="text-[10px] text-muted font-black uppercase tracking-widest whitespace-nowrap">
                        CONCURRENCY: <span className="text-sharp">{health.webSocketSessions}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SystemHealthPanel;
