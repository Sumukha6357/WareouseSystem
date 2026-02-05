'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface PickTask {
    taskId: string;
    orderId: string;
    orderNumber: string;
    product: {
        productId: string;
        name: string;
        sku: string;
        category: string;
    };
    blockId: string;
    blockName: string;
    quantity: number;
    assignedTo: string;
    status: string;
    notes?: string;
    createdAt: number;
    lastModifiedAt: number;
    completedAt?: number;
}

export default function PickTaskView() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<PickTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [selectedTask, setSelectedTask] = useState<PickTask | null>(null);


    useEffect(() => {
        if (user) {
            fetchMyTasks();
        } else {
            // Optional: Handle case where user is not loaded yet if relying on parent protection
        }
    }, [user]);

    const fetchMyTasks = async () => {
        try {
            if (!user) {
                // Should useAuth handle redirection? Or parent? 
                // But definitely don't toast generic error if we know user is missing
                return;
            }

            const response = await api.get(`/orders/pick-tasks/picker/${user.username}`);
            if (response.data.status === 200) {
                setTasks(response.data.data || []);
            }
        } catch (error) {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const startTask = async (taskId: string) => {
        try {
            const response = await api.put(`/orders/pick-tasks/${taskId}/start`);
            if (response.data.status === 200) {
                toast.success('Task started successfully');
                fetchMyTasks();
            } else {
                toast.error(response.data.message || 'Failed to start task');
            }
        } catch (error) {
            toast.error('Failed to start task');
        }
    };

    const completeTask = async (taskId: string) => {
        if (!confirm('Are you sure you have picked all items for this task?')) return;

        try {
            const response = await api.put(`/orders/pick-tasks/${taskId}/complete`);
            if (response.data.status === 200) {
                toast.success('Task completed successfully');
                fetchMyTasks();
            } else {
                toast.error(response.data.message || 'Failed to complete task');
            }
        } catch (error) {
            toast.error('Failed to complete task');
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            ASSIGNED: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
            IN_PROGRESS: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
            COMPLETED: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
            CANCELLED: 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
        };
        return colors[status] || 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    };

    const getPriorityIcon = (status: string) => {
        if (status === 'ASSIGNED') return '🔵';
        if (status === 'IN_PROGRESS') return '⚡';
        if (status === 'COMPLETED') return '✅';
        return '⚪';
    };

    const filteredTasks = filterStatus === 'ALL'
        ? tasks
        : tasks.filter(task => task.status === filterStatus);

    const activeTasks = tasks.filter(t => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS');
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

    if (loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-xl"></div>
                <p className="text-muted font-bold text-sm uppercase tracking-widest">Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 animate-slide-up">
            {/* Header */}
            <div className="glass-card p-6 rounded-3xl border-2 border-card-border">
                <h1 className="text-3xl font-black text-sharp mb-3 flex items-center gap-3">
                    <span className="text-4xl">📦</span>
                    My Pick Tasks
                </h1>
                <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600"></div>
                        <span className="text-muted font-medium">Active:</span>
                        <strong className="text-sharp text-lg">{activeTasks.length}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600"></div>
                        <span className="text-muted font-medium">Completed:</span>
                        <strong className="text-sharp text-lg">{completedTasks.length}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600"></div>
                        <span className="text-muted font-medium">Total:</span>
                        <strong className="text-sharp text-lg">{tasks.length}</strong>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex bg-card p-2 rounded-2xl border-2 border-card-border shadow-sm overflow-x-auto no-scrollbar gap-2">
                {['ALL', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${filterStatus === status
                            ? 'bg-gradient-primary text-white shadow-lg shadow-primary/20 scale-105'
                            : 'text-muted hover:text-sharp hover:bg-background'
                            }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-3xl border-2 border-dashed border-card-border">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-muted font-black text-lg uppercase tracking-widest">No tasks found</p>
                    <p className="text-muted/60 text-sm mt-2 font-medium">
                        {filterStatus === 'ALL'
                            ? 'You have no assigned tasks at the moment'
                            : `No ${filterStatus.toLowerCase().replace('_', ' ')} tasks`}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredTasks.map(task => (
                        <div
                            key={task.taskId}
                            className={`glass-card rounded-3xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 ${task.status === 'IN_PROGRESS'
                                ? 'border-amber-400 dark:border-amber-600 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-900/10 dark:to-yellow-900/10'
                                : 'border-card-border hover:border-primary/30'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">{getPriorityIcon(task.status)}</span>
                                        <h3 className="font-black text-xl text-sharp">{task.product.name}</h3>
                                    </div>
                                    <div className="flex gap-4 text-sm text-muted font-medium">
                                        <span>SKU: <strong className="text-sharp">{task.product.sku}</strong></span>
                                        <span>Order: <strong className="text-sharp">{task.orderNumber}</strong></span>
                                    </div>
                                </div>
                                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg ${getStatusColor(task.status)}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-background/50 dark:bg-card/50 rounded-2xl border border-card-border/50">
                                <div>
                                    <p className="text-xs text-muted uppercase font-black tracking-wider mb-1">Location</p>
                                    <p className="font-black text-primary text-lg">{task.blockName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted uppercase font-black tracking-wider mb-1">Quantity</p>
                                    <p className="font-black text-sharp text-2xl">{task.quantity} <span className="text-sm text-muted">units</span></p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted uppercase font-black tracking-wider mb-1">Category</p>
                                    <p className="font-bold text-sharp">{task.product.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted uppercase font-black tracking-wider mb-1">Created</p>
                                    <p className="text-sm font-bold text-sharp">{new Date(task.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {task.notes && (
                                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                                    <p className="text-xs text-muted uppercase font-black tracking-wider mb-2">Notes</p>
                                    <p className="text-sm font-medium text-sharp">{task.notes}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {task.status === 'ASSIGNED' && (
                                    <button
                                        onClick={() => startTask(task.taskId)}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:opacity-90 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        🚀 Start Picking
                                    </button>
                                )}
                                {task.status === 'IN_PROGRESS' && (
                                    <button
                                        onClick={() => completeTask(task.taskId)}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:opacity-90 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        ✅ Complete Task
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedTask(task)}
                                    className="px-6 py-3 bg-background dark:bg-card border-2 border-card-border text-sharp rounded-xl hover:border-primary hover:bg-primary/5 font-bold transition-all duration-300 hover:scale-105"
                                >
                                    📋 Details
                                </button>
                            </div>

                            {task.status === 'IN_PROGRESS' && (
                                <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl">
                                    <p className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                                        <span className="text-lg">⚡</span>
                                        Task in progress - Complete when all items are picked
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Task Details Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Task Details</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTask.status)}`}>
                                    {selectedTask.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="border-t pt-3">
                                <h3 className="font-semibold mb-2">Product Information</h3>
                                <p><strong>Name:</strong> {selectedTask.product.name}</p>
                                <p><strong>SKU:</strong> {selectedTask.product.sku}</p>
                                <p><strong>Category:</strong> {selectedTask.product.category}</p>
                            </div>

                            <div className="border-t pt-3">
                                <h3 className="font-semibold mb-2">Pick Information</h3>
                                <p><strong>Location:</strong> {selectedTask.blockName}</p>
                                <p><strong>Quantity:</strong> {selectedTask.quantity} units</p>
                                <p><strong>Order Number:</strong> {selectedTask.orderNumber}</p>
                            </div>

                            <div className="border-t pt-3">
                                <h3 className="font-semibold mb-2">Timeline</h3>
                                <p><strong>Created:</strong> {new Date(selectedTask.createdAt).toLocaleString()}</p>
                                <p><strong>Last Modified:</strong> {new Date(selectedTask.lastModifiedAt).toLocaleString()}</p>
                                {selectedTask.completedAt && (
                                    <p><strong>Completed:</strong> {new Date(selectedTask.completedAt).toLocaleString()}</p>
                                )}
                            </div>

                            {selectedTask.notes && (
                                <div className="border-t pt-3">
                                    <h3 className="font-semibold mb-2">Notes</h3>
                                    <p className="text-gray-700">{selectedTask.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {selectedTask.status === 'ASSIGNED' && (
                                <button
                                    onClick={() => {
                                        startTask(selectedTask.taskId);
                                        setSelectedTask(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Start Picking
                                </button>
                            )}
                            {selectedTask.status === 'IN_PROGRESS' && (
                                <button
                                    onClick={() => {
                                        completeTask(selectedTask.taskId);
                                        setSelectedTask(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Complete Task
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
