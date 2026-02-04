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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="text-gray-500 font-medium">Loading user database...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">User Directory</h3>
                    <p className="text-sm font-medium text-gray-400">Manage system access and roles</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Access Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Member Since</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.userId} className="hover:bg-indigo-50/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0 shadow-sm border border-indigo-100">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
                                                    <div className="flex items-center text-xs text-gray-400 gap-1.5 mt-0.5">
                                                        <Mail className="h-3 w-3" />
                                                        <span className="truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.userRole === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                <Shield className="h-3 w-3" />
                                                {user.userRole}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-500 gap-2">
                                                <Calendar className="h-4 w-4 text-gray-300" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button onClick={() => handleEditUser(user)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-600">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button onClick={() => setDeletingUserId(user.userId)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-gray-50 rounded-full text-gray-300">
                                                <UsersIcon className="h-8 w-8" />
                                            </div>
                                            <p className="text-gray-400 font-medium">No users found matching your search</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Edit User</h3>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2">Username</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-300 text-sm py-2 px-3"
                                    value={editFormData.username}
                                    onChange={e => setEditFormData({ ...editFormData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full rounded-lg border-gray-300 text-sm py-2 px-3"
                                    value={editFormData.email}
                                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2">Role</label>
                                <select
                                    className="w-full rounded-lg border-gray-300 text-sm py-2 px-3"
                                    value={editFormData.userRole}
                                    onChange={e => setEditFormData({ ...editFormData, userRole: e.target.value })}
                                >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="STAFF">STAFF</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" isLoading={loading}>Save Changes</Button>
                                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingUserId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User?</h3>
                        <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The user will be permanently removed from the system.</p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setDeletingUserId(null)}>Cancel</Button>
                            <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteUser(deletingUserId)} isLoading={loading}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
