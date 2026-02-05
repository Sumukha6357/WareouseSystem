'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User } from 'lucide-react';

interface AssignPickerModalProps {
    orderId: string;
    users: { username: string; userRole: string }[];
    assignedTo: string;
    onAssignedToChange: (username: string) => void;
    onAssign: () => void;
    onClose: () => void;
    isLoading?: boolean;
}

export default function AssignPickerModal({
    orderId,
    users,
    assignedTo,
    onAssignedToChange,
    onAssign,
    onClose,
    isLoading = false
}: AssignPickerModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
            <div className="bg-card rounded-[3.5rem] p-12 max-w-lg w-full border-2 border-card-border shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-sharp tracking-tighter">Deploy Personnel</h2>
                        <p className="text-sm font-medium text-muted mt-1">Assign operator to extraction sequence</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-3xl text-primary border border-primary/10">
                        <User size={32} />
                    </div>
                </div>

                <div className="space-y-8 mb-10">
                    <div>
                        <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-3 ml-1">Assigned Operator</label>
                        {users.length > 0 ? (
                            <select
                                value={assignedTo}
                                onChange={(e) => onAssignedToChange(e.target.value)}
                                className="w-full px-6 py-4 bg-background border-2 border-input-border rounded-2xl text-sharp font-black uppercase tracking-widest text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-pointer appearance-none"
                            >
                                <option value="">-- SYSTEM_SELECT_USER --</option>
                                {users.map(u => (
                                    <option key={u.username} value={u.username}>
                                        {u.username} // {u.userRole}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <Input
                                placeholder="INPUT_MANUAL_HANDLE"
                                value={assignedTo}
                                onChange={(e) => onAssignedToChange(e.target.value)}
                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={onAssign}
                        className="w-full py-6 text-xs font-black uppercase tracking-widest"
                        isLoading={isLoading}
                    >
                        Confirm Deployment
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full py-4 text-[10px] font-black uppercase tracking-widest"
                    >
                        Abort Sequence
                    </Button>
                </div>
            </div>
        </div>
    );
}
