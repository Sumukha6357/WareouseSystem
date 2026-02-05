import React from 'react';
import { Activity } from 'lucide-react';
import { PickerWorkloadResponse } from '../../services/AnalyticsService';

interface TeamWorkloadPanelProps {
    data: PickerWorkloadResponse[];
}

const TeamWorkloadPanel: React.FC<TeamWorkloadPanelProps> = ({ data }) => {
    return (
        <div className="bg-card p-10 rounded-[3.5rem] border-2 border-card-border shadow-sm mb-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <Activity size={300} className="text-primary" />
            </div>
            <h2 className="text-2xl font-black text-sharp mb-10 uppercase tracking-widest flex items-center gap-4">
                <span className="text-3xl text-primary">⚡</span>
                Operational Load Balancing (TEAM PULSE)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {data && data.length > 0 ? (
                    data.map((picker) => (
                        <div key={picker.username} className={`p-8 rounded-[2.5rem] border-2 flex flex-col gap-6 transition-all hover:shadow-xl group bg-background ${picker.status === 'OVERLOADED' ? 'border-red-500/30' :
                            picker.status === 'ACTIVE' ? 'border-emerald-500/30' :
                                'border-card-border'
                            }`}>
                            <div className="flex justify-between items-center">
                                <span className="font-black text-sharp text-lg group-hover:text-primary transition-colors">{picker.username}</span>
                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border-2 uppercase tracking-widest ${picker.status === 'OVERLOADED' ? 'bg-red-500/10 text-red-700 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                                    picker.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                                        'bg-background border-card-border/50 text-muted'
                                    }`}>
                                    {picker.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-card p-4 rounded-2xl border border-card-border/50">
                                    <p className="text-muted text-[8px] font-black uppercase tracking-widest mb-1">Queue Load</p>
                                    <p className="font-black text-2xl text-sharp">{picker.activeTaskCount}</p>
                                </div>
                                <div className="bg-card p-4 rounded-2xl border border-card-border/50">
                                    <p className="text-muted text-[8px] font-black uppercase tracking-widest mb-1">Success Ops</p>
                                    <p className="font-black text-2xl text-sharp">{picker.completedTodayCount}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-4 py-16 text-center bg-background rounded-[3rem] border-4 border-dashed border-card-border">
                        <p className="text-muted font-black text-sm uppercase tracking-widest">Command Personnel Offline</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamWorkloadPanel;
