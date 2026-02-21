import React from 'react';
import { Activity } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { PickerWorkloadResponse } from '@/types/api';

interface TeamWorkloadPanelProps {
    data: PickerWorkloadResponse[];
}

const TeamWorkloadPanel: React.FC<TeamWorkloadPanelProps> = ({ data }) => {
    return (
        <Card className="shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Activity size={300} className="text-primary" />
            </div>
            <CardHeader className="pb-8 border-b border-card-border/30">
                <CardTitle className="flex items-center gap-4 text-sharp italic">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <Activity size={20} />
                    </div>
                    Team Operational Pulse
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data && data.length > 0 ? (
                        data.map((picker) => (
                            <div key={picker.username} className={`p-8 rounded-[2.5rem] border-2 flex flex-col gap-6 transition-all hover:shadow-xl group bg-background ${picker.status === 'OVERLOADED' ? 'border-red-500/30' :
                                picker.status === 'ACTIVE' ? 'border-emerald-500/30' :
                                    'border-card-border'
                                }`}>
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-sharp text-lg group-hover:text-primary transition-colors">{picker.username}</span>
                                    <Badge
                                        variant={picker.status === 'OVERLOADED' ? 'danger' : picker.status === 'ACTIVE' ? 'success' : 'secondary'}
                                        className="h-8 px-3 text-[9px] font-black uppercase tracking-widest border-2"
                                    >
                                        {picker.status}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-card p-4 rounded-2xl border border-card-border/50 shadow-sm">
                                        <p className="text-muted text-[8px] font-black uppercase tracking-widest mb-1">Queue Load</p>
                                        <p className="font-black text-2xl text-sharp leading-none">{picker.activeTaskCount}</p>
                                    </div>
                                    <div className="bg-card p-4 rounded-2xl border border-card-border/50 shadow-sm">
                                        <p className="text-muted text-[8px] font-black uppercase tracking-widest mb-1">Ops Today</p>
                                        <p className="font-black text-2xl text-sharp leading-none">{picker.completedTodayCount}</p>
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
            </CardContent>
        </Card>
    );
};

export default TeamWorkloadPanel;
