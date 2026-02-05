'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Users as UsersIcon, Mail, Shield, Calendar, Trash2, Edit2, Search, Filter } from 'lucide-react';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState({ username: '', email: '', userRole: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
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
        setLoading(true);
        try {
            await api.put(`/users/${editingUser.userId}`, {
                userId: editingUser.userId,
                username: editFormData.username,
                email: editFormData.email,
                userRole: editFormData.userRole
            });
            await fetchUsers();
            setEditingUser(null);
        } catch (error) {
            console.error('Failed to update user', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        setLoading(true);
        try {
            await api.delete(`/users/${userId}`);
            await fetchUsers();
            setDeletingUserId(null);
        } catch (error) {
            console.error('Failed to delete user', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl"></div>
                <p className="text-muted font-black text-[10px] uppercase tracking-[0.2em]">Querying Authorization Layer...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                <div>
                    <h3 className="text-3xl font-black text-sharp tracking-tight flex items-center gap-3">
                        <UsersIcon className="h-8 w-8 text-primary" />
                        Access Credentials
                    </h3>
                    <p className="text-sm font-medium text-muted mt-1">Orchestration of system entities and permission tiers</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter access nodes..."
                            className="w-full pl-12 pr-6 py-4 bg-card border-2 border-input-border rounded-2xl text-sharp text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all shadow-sm outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-[2.5rem] shadow-sm border-2 border-card-border overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background border-b-2 border-card-border">
                                <th className="px-8 py-6 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Entity Signature</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Access tier</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Registration Cycle</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted uppercase tracking-[0.2em] text-right">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-card-border/30">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.userId} className="hover:bg-primary/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border-2 border-primary/20 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-base font-black text-sharp group-hover:text-primary transition-colors truncate">{user.username}</p>
                                                    <div className="flex items-center text-[10px] font-black text-muted uppercase tracking-widest gap-2 mt-1">
                                                        <Mail className="h-3 w-3 text-primary/50" />
                                                        <span className="truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${user.userRole === 'ADMIN'
                                                ? 'bg-purple-500/5 text-purple-700 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]'
                                                : 'bg-emerald-500/5 text-emerald-700 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                                                }`}>
                                                <Shield className="h-3.5 w-3.5" />
                                                {user.userRole}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center text-[10px] font-black text-muted uppercase tracking-widest gap-2">
                                                <Calendar className="h-3.5 w-3.5 text-primary/40" />
                                                {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                                                <button onClick={() => handleEditUser(user)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-background border border-card-border/50 text-muted hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => setDeletingUserId(user.userId)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-background border border-card-border/50 text-muted hover:text-red-600 hover:border-red-500/30 transition-all shadow-sm">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-6 bg-background rounded-3xl border-2 border-dashed border-card-border text-muted/20">
                                                <UsersIcon size={48} strokeWidth={1} />
                                            </div>
                                            <p className="text-muted font-black text-xs uppercase tracking-[0.3em]">No matching entities found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Entity Modification Interface */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-card rounded-[3rem] shadow-2xl shadow-primary/10 max-w-lg w-full p-12 border-2 border-card-border/50 animate-in zoom-in-95 self-center">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-sharp tracking-tighter">Modify Credentials</h3>
                                <p className="text-sm font-medium text-muted mt-1">Adjust administrative permissions</p>
                            </div>
                            <button onClick={() => setEditingUser(null)} className="p-3 hover:bg-background rounded-2xl text-muted hover:text-sharp transition-all border border-transparent hover:border-card-border/50">
                                <Trash2 className="h-6 w-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-3 ml-1">Entity Handle</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full rounded-2xl border-2 border-input-border bg-background py-4 px-6 text-lg font-black text-sharp outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        value={editFormData.username}
                                        onChange={e => setEditFormData({ ...editFormData, username: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-3 ml-1">System Mailbox</label>
                                <input
                                    type="email"
                                    className="w-full rounded-2xl border-2 border-input-border bg-background py-4 px-6 text-lg font-black text-sharp outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                    value={editFormData.email}
                                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-3 ml-1">Access Tier Logic</label>
                                <select
                                    className="w-full rounded-2xl border-2 border-input-border bg-background py-4 px-6 text-sm font-black uppercase tracking-widest text-sharp outline-none appearance-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                                    value={editFormData.userRole}
                                    onChange={e => setEditFormData({ ...editFormData, userRole: e.target.value })}
                                >
                                    <option value="ADMIN">ADMINISTRATOR_LEVEL_0</option>
                                    <option value="STAFF">OPERATIONAL_STAFF_LEVEL_1</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-3 pt-6 border-t border-card-border/50">
                                <Button type="submit" isLoading={loading} className="w-full py-6 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/20">Synchronize Nodes</Button>
                                <Button variant="ghost" className="w-full py-4 text-[10px] font-black uppercase tracking-widest" onClick={() => setEditingUser(null)}>Abort Cycle</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Termination Sequence Confirmation */}
            {deletingUserId && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-card rounded-[3rem] shadow-2xl max-w-md w-full p-10 border-2 border-red-500/20 animate-in zoom-in-95 self-center">
                        <div className="h-20 w-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-600 mb-8 border-2 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-sharp tracking-tighter mb-4">Decommission Entity?</h3>
                        <p className="text-sm font-medium text-muted mb-10 leading-relaxed">This operation will permanently purge the selected entity signature from the authorization database. This action is irreversible.</p>
                        <div className="flex flex-col gap-3">
                            <Button className="w-full py-6 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-red-600/20 border-0" onClick={() => handleDeleteUser(deletingUserId)} isLoading={loading}>
                                EXECUTE PURGE
                            </Button>
                            <Button variant="ghost" className="w-full py-4 text-[10px] font-black uppercase tracking-widest" onClick={() => setDeletingUserId(null)}>
                                CANCEL PROTOCOL
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
