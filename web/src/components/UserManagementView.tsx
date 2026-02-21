'use client';

import { useEffect, useState } from 'react';
import httpClient from '@/lib/httpClient';
import { Button } from '@/components/ui/Button';
import { Users as UsersIcon, Mail, Shield, Calendar, Trash2, Edit2, Search, UserPlus } from 'lucide-react';
import { notify } from '@/lib/notify';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorState from './ui/ErrorState';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/Table';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { FormField } from './ui/FormField';
import { useWebSocket } from '@/hooks/useWebSocket';

interface User {
    userId: string;
    username: string;
    email: string;
    userRole: string;
    createdAt: number;
}

export default function UserManagementView() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [editFormData, setEditFormData] = useState({ username: '', email: '', userRole: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    // WebSocket Integration for real-time user updates
    useWebSocket('/topic/users', () => {
        console.log('User update received');
        fetchUsers();
    });

    const fetchUsers = async () => {
        try {
            setError(false);
            setLoading(true);
            const data = await httpClient.get<User[]>('/users');
            setUsers(data || []);
        } catch (err) {
            console.error('Failed to fetch users', err);
            setError(true);
            notify.error('Failed to synchronize access nodes');
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setEditFormData({ username: user.username, email: user.email, userRole: user.userRole });
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            setLoading(true);
            await httpClient.put(`/users/${editingUser.userId}`, {
                userId: editingUser.userId,
                username: editFormData.username,
                email: editFormData.email,
                userRole: editFormData.userRole
            });
            notify.success('Credentials updated successfully');
            await fetchUsers();
            setEditingUser(null);
        } catch (error) {
            console.error('Failed to update user', error);
            notify.error('Failed to update credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!deletingUser) return;
        try {
            setLoading(true);
            await httpClient.delete(`/users/${deletingUser.userId}`);
            notify.success('Entity decommissioned successfully');
            await fetchUsers();
            setDeletingUser(null);
        } catch (error) {
            console.error('Failed to delete user', error);
            notify.error('Failed to decommission entity');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && users.length === 0) {
        return <LoadingSpinner message="Querying Authorization Layer..." />;
    }

    if (error && users.length === 0) {
        return <ErrorState onRetry={fetchUsers} message="Access Control Synchronization Failed" />;
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4 italic uppercase">
                        <UsersIcon className="h-10 w-10 text-primary" />
                        Access Credentials
                    </h1>
                    <p className="text-sm font-medium text-muted mt-2">Orchestration of system entities and permission tiers.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter access nodes..."
                            className="w-full pl-12 pr-6 py-4 bg-card border-2 border-card-border rounded-2xl text-sharp text-xs font-black uppercase tracking-[0.2em] focus:ring-4 focus:ring-primary/10 transition-all shadow-sm outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-8 py-6">Entity Signature</TableHead>
                        <TableHead className="px-8 py-6">Access Tier</TableHead>
                        <TableHead className="px-8 py-6">Registration Cycle</TableHead>
                        <TableHead className="px-8 py-6 text-right">Control Flow</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <TableRow key={user.userId} className="group">
                                <TableCell className="px-8 py-6">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl border-2 border-primary/20 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shrink-0">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-lg font-black text-sharp group-hover:text-primary transition-colors truncate italic uppercase tracking-tighter">{user.username}</p>
                                            <div className="flex items-center text-[10px] font-black text-muted uppercase tracking-[0.1em] gap-2 mt-1 font-mono">
                                                <Mail className="h-3 w-3 text-primary/40" />
                                                <span className="truncate opacity-60">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-8 py-6">
                                    <Badge variant={user.userRole === 'ADMIN' ? 'secondary' : 'primary'} className="h-7 px-4">
                                        <Shield className="h-3.5 w-3.5 mr-2 opacity-50" />
                                        {user.userRole}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-8 py-6">
                                    <div className="flex items-center text-[10px] font-black text-muted uppercase tracking-[0.1em] gap-2 bg-background/50 px-3 py-1.5 rounded-xl border border-card-border/50 w-fit">
                                        <Calendar className="h-3.5 w-3.5 text-primary/30" />
                                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>
                                </TableCell>
                                <TableCell className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleEditUser(user)}
                                            className="h-11 w-11 rounded-xl shadow-lg border-card-border/50 bg-card hover:border-primary/30 hover:text-primary"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setDeletingUser(user)}
                                            className="h-11 w-11 rounded-xl shadow-lg border-card-border/50 bg-card hover:border-red-500/30 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-80 text-center">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="p-8 bg-background/50 rounded-[2.5rem] border-4 border-dashed border-card-border text-muted/10">
                                        <UsersIcon size={64} strokeWidth={1} />
                                    </div>
                                    <div>
                                        <p className="text-muted font-black text-sm uppercase tracking-[0.4em]">Zero Match Topology</p>
                                        <p className="text-[10px] text-muted/40 font-bold uppercase tracking-widest mt-2 italic">No security nodes match your current search vector.</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setSearchTerm('')} className="mt-2">Clear Identity Filter</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                title="Credential Modification"
                maxWidth="md"
            >
                <form onSubmit={handleUpdateUser} className="space-y-8">
                    <FormField
                        label="Entity Handle"
                        value={editFormData.username}
                        onChange={e => setEditFormData({ ...editFormData, username: e.target.value })}
                        placeholder="System Username"
                        required
                    />
                    <FormField
                        label="System Mailbox"
                        type="email"
                        value={editFormData.email}
                        onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                        placeholder="operator@nexus.logistics"
                        required
                    />
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] block ml-1 leading-none">Access Tier Logic</label>
                        <select
                            className="w-full rounded-[1.5rem] border-2 border-input-border bg-background py-4 px-6 text-[10px] font-black uppercase tracking-widest text-sharp outline-none appearance-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer shadow-inner"
                            value={editFormData.userRole}
                            onChange={e => setEditFormData({ ...editFormData, userRole: e.target.value })}
                        >
                            <option value="ADMIN">ADMINISTRATOR_LEVEL_001</option>
                            <option value="STAFF">OPERATIONAL_NODE_LEVEL_010</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-3 pt-8 border-t border-card-border/30">
                        <Button type="submit" isLoading={loading} className="w-full py-6 shadow-2xl shadow-primary/30">Commit Changeset</Button>
                        <Button variant="ghost" className="w-full" onClick={() => setEditingUser(null)}>Abort Interface</Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={!!deletingUser}
                onClose={() => setDeletingUser(null)}
                title="Entity Decommissioning"
                maxWidth="sm"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="h-24 w-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-600 mb-8 border-2 border-red-500/20 shadow-2xl shadow-red-500/10">
                        <Trash2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-sharp tracking-tighter mb-4 uppercase italic">Decommission Protocol?</h3>
                    <p className="text-sm font-medium text-muted mb-10 leading-relaxed max-w-xs">
                        This operation will permanently purge the agent signature <span className="text-sharp font-black">{deletingUser?.username}</span> from the central authorization registry.
                    </p>
                    <div className="flex flex-col gap-3 w-full">
                        <Button
                            className="w-full py-6 bg-red-600 hover:bg-red-700 text-white shadow-2xl shadow-red-600/30 border-none"
                            onClick={handleDeleteUser}
                            isLoading={loading}
                        >
                            Execute Purge Sequence
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => setDeletingUser(null)}>
                            Cancel Termination
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
