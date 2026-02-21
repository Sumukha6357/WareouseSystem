'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { User } from 'lucide-react';

interface AssignPickerModalProps {
    users: { username: string; userRole: string }[];
    assignedTo: string;
    onAssignedToChange: (username: string) => void;
    onAssign: () => void;
    onClose: () => void;
    isLoading?: boolean;
}

export default function AssignPickerModal({
    users,
    assignedTo,
    onAssignedToChange,
    onAssign,
    onClose,
    isLoading = false
}: AssignPickerModalProps) {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Deploy Personnel"
            maxWidth="md"
        >
            <div className="space-y-10">
                <p className="text-sm font-medium text-muted">
                    Assign operator to extraction sequence
                </p>

                <div className="space-y-8">
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
                                        {u.username} | {u.userRole}
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

                <div className="flex flex-col gap-3 pt-10 border-t border-card-border/30">
                    <Button
                        onClick={onAssign}
                        className="w-full py-6 text-xs font-black uppercase tracking-widest h-14"
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
        </Modal>
    );
}
