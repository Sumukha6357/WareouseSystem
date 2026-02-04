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
            ASSIGNED: 'bg-blue-100 text-blue-800',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
            COMPLETED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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
        return <div className="p-8 text-center">Loading tasks...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">My Pick Tasks</h1>
                <div className="flex gap-4 text-sm text-gray-600">
                    <span>Active Tasks: <strong>{activeTasks.length}</strong></span>
                    <span>Completed: <strong>{completedTasks.length}</strong></span>
                    <span>Total: <strong>{tasks.length}</strong></span>
                </div>
            </div>

            {/* Filter */}
            <div className="mb-4 flex gap-2">
                {['ALL', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1 rounded ${filterStatus === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No tasks found</p>
                    <p className="text-gray-400 text-sm mt-2">
                        {filterStatus === 'ALL'
                            ? 'You have no assigned tasks at the moment'
                            : `No ${filterStatus.toLowerCase().replace('_', ' ')} tasks`}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredTasks.map(task => (
                        <div
                            key={task.taskId}
                            className={`bg-white border-2 rounded-lg p-4 shadow-sm transition-all hover:shadow-md ${task.status === 'IN_PROGRESS' ? 'border-yellow-400' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-2xl">{getPriorityIcon(task.status)}</span>
                                        <h3 className="font-semibold text-lg">{task.product.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">SKU: {task.product.sku}</p>
                                    <p className="text-sm text-gray-600">Order: {task.orderNumber}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Location</p>
                                    <p className="font-semibold text-blue-600">{task.blockName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Quantity</p>
                                    <p className="font-semibold text-lg">{task.quantity} units</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Category</p>
                                    <p className="font-medium">{task.product.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Created</p>
                                    <p className="text-sm">{new Date(task.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {task.notes && (
                                <div className="mb-3 p-2 bg-blue-50 rounded">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Notes</p>
                                    <p className="text-sm">{task.notes}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {task.status === 'ASSIGNED' && (
                                    <button
                                        onClick={() => startTask(task.taskId)}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                    >
                                        Start Picking
                                    </button>
                                )}
                                {task.status === 'IN_PROGRESS' && (
                                    <button
                                        onClick={() => completeTask(task.taskId)}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                    >
                                        Complete Task
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedTask(task)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Details
                                </button>
                            </div>

                            {task.status === 'IN_PROGRESS' && (
                                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                    <p className="text-sm text-yellow-800">
                                        ⚡ Task in progress - Complete when all items are picked
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
